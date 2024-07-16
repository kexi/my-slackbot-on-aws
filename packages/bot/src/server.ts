import {App, AwsLambdaReceiver, View} from "@slack/bolt";
import {SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET} from "./env";
import {APIGatewayProxyHandler} from "aws-lambda";

const receiver = new AwsLambdaReceiver({
  signingSecret: SLACK_SIGNING_SECRET
})

const app = new App({
  receiver,
  token: SLACK_BOT_TOKEN,
})

app.command('/open_dialog', async ({ack, body, client}) => {
  await ack()
  const modal: View = {
      type: 'modal',
      callback_id: 'dialog_submission',
      title: {
        type: 'plain_text',
        text: 'My Dialog'
      },
      submit: {
        type: 'plain_text',
        text: 'Submit'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'input_block',
          label: {
            type: 'plain_text',
            text: 'Enter some text'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'text_input'
          }
        }
      ],
      private_metadata: JSON.stringify({
        channel: body.channel_id,
        thread_ts: body.event_ts || body.ts
      })

  };

  await client.views.open({
    trigger_id: body.trigger_id,
    view: modal,
  });

})

app.view('dialog_submission', async ({ ack, view, client,body }) => {
  await ack();

  const textInput = view.state.values.input_block.text_input.value;

  const privateMetadata = JSON.parse(view.private_metadata);

  try {
    await client.chat.postMessage({
      channel: privateMetadata.channel,
      thread_ts: privateMetadata.thread_ts,
      text: `Thanks for your submission. You entered: ${textInput}`,

    });
  } catch (error) {
    console.error(`Error sending message: ${error}`);
  }
});

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {
  const receiverHandler = await receiver.start()
  return receiverHandler(event, context, callback)
}
