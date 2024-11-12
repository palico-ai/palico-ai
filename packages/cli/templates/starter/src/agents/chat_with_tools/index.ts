import {
  ChatRequest,
  Chat,
  getConversationState,
  logger,
  setConversationState,
} from '@palico-ai/app';
import { Message } from './types';
import { tools } from './tools';
import { agentExecutor } from './agent_executor';
import { openaiChatCompletion } from './openai';

export interface State {
  messages: Message[];
}

const MAX_STEPS = 5;

const handler: Chat = async (params) => {
  const { conversationId, stream } = params;
  const state = await createOrRestoreState(params);
  logger.log('calling agent executor with: ', state.messages);
  const response = await agentExecutor({
    messages: state.messages,
    maxSteps: MAX_STEPS,
    chatCompletion: openaiChatCompletion,
    tools,
    onToolCall: (toolCall) => {
      const resultString = JSON.stringify(toolCall.result);
      stream.push({
        intermediateSteps: [
          {
            name:
              `Function Call: ${toolCall.name}()` +
              (resultString.length > 20 ? '' : ': ' + resultString),
            data: {
              input: toolCall.parameters,
              result: toolCall.result,
            },
          },
        ],
      });
    },
  });
  logger.log('response from agent executor', response);
  if (response.finalMessage || response.externalToolCalls) {
    stream.push({
      message: response.finalMessage,
      toolCalls: response.externalToolCalls,
    });
  }
  logger.log('setting conversation state', response.messages);
  await setConversationState<State>(conversationId, {
    messages: response.messages,
  });
};

const createOrRestoreState = async (params: ChatRequest): Promise<State> => {
  const { toolCallResults, userMessage, isNewConversation, conversationId } =
    params;
  if (!userMessage && !toolCallResults) {
    throw new Error('No user message or tool call results');
  }
  let state: State;
  if (isNewConversation) {
    state = {
      messages: [],
    };
  } else {
    state = await getConversationState<State>(conversationId);
  }
  logger.log('building prompt messages', state);
  if (userMessage) {
    console.log('user message', userMessage);
    state.messages.push({
      role: 'user',
      content: userMessage,
    });
  }
  if (toolCallResults) {
    toolCallResults.forEach((toolCallResult) => {
      state.messages.push({
        role: 'tool',
        toolCallResult,
      });
    });
  }
  return state;
};

export default handler;
