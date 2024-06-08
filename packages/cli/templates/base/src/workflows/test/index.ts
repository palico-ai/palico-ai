import { Application, ChainWorkflow } from '@palico-ai/app';
import IntentClassifierAgent from '../../agents/chatbot';

export const TEST_WORKFLOW_NAME = __dirname.split('/').pop();

const chain = ChainWorkflow.create('node1', async (input, context) => {
  console.log('node1', input, context);
  return {
    node1: 'hi there',
  };
})
  .link('node2', async (input) => {
    return {
      node2: 'hello',
    };
  })
  .link('node3', async (input) => {
    return {
      node3: 'hi',
    };
  })
  .link('call llm', async (input) => {
    console.log('call llm', input);
    const response = await Application.chat({
      agentName: IntentClassifierAgent.NAME,
      content: {
        userMessage: input.userMessage,
        payload: input.payload,
      },
    });
    return {
      agent: response,
    };
  })
  .send(async (input, context) => {
    console.log(`current input: ${JSON.stringify(input)}`);
    console.log(`context: ${JSON.stringify(context)}`);
    return {
      message: input.agent.message,
      data: input.agent.data,
      conversationId: input.agent.conversationId,
      requestId: input.agent.requestId,
    };
  });

export default chain;
