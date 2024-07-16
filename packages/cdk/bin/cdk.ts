#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {CdkStack} from '../lib/cdk-stack';
import {EnvironmentName} from "../config";


const app = new cdk.App();


new CdkStack(app, 'CdkStack', {
  envName: process.env.APP_ENV as EnvironmentName ?? 'development',
});
