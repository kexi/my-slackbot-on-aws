import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_lambda, aws_lambda_nodejs} from "aws-cdk-lib";
import {APP_NAME, EnvironmentName} from "../config";



export type CdkStackProps = cdk.StackProps & {
  readonly envName: EnvironmentName;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, `${APP_NAME}-${props?.envName}-${id}`, props);

    // シークレットマネージャーから値を取得する関数
    const getSSMParameter = (name: string): string => {

      const key = `/${APP_NAME}/${props?.envName}/${name}`;
      const value = cdk.aws_ssm.StringParameter.valueForStringParameter(this, key);
      if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
      }
      return value;
    }

    // Lambda
    const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(this, `lambda`, {
      functionName: `${APP_NAME}-${props.envName}-lambda`,
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      entry: '../bot/src/server.ts',
      environment: {
        APP_ENV: props.envName,
        SLACK_SIGNING_SECRET: getSSMParameter('SLACK_SIGNING_SECRET'),
        SLACK_BOT_TOKEN: getSSMParameter('SLACK_BOT_TOKEN'),
      }
    });

    const integration = new cdk.aws_apigateway.LambdaIntegration(lambda, {
      requestTemplates: { 'application/json': '$input.json("$")' },
    });
    // API Gateway
    const api = new cdk.aws_apigateway.RestApi(this, `${APP_NAME}-${props?.envName}-api`, {
      deployOptions: {
        tracingEnabled: true,
        stageName: 'api',
      },
      defaultIntegration: integration,
    });

    api.root.addProxy({
      defaultIntegration: integration,
    })

    const apiResource = api.root.addResource('api');
    const slackResource = apiResource.addResource('slack');
    const eventsResource = slackResource.addResource('events');
    eventsResource.addMethod('POST', integration);
    const commandsResource = slackResource.addResource('commands');
    commandsResource.addResource('open_dialog').addMethod('POST', integration);

  }
}


