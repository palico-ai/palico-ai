import { AgentResponse } from '@palico-ai/common';
import { AgentModel } from './model';
import { getTracer } from '../tracing';
import { NewChatRequestParams } from './chat';

export interface AgentExecutorChatParams extends NewChatRequestParams {
  agentName: string;
}

const tracer = getTracer('AgentExecutor');

export default class AgentExecutor {
  static async chat(params: AgentExecutorChatParams): Promise<AgentResponse> {
    return await tracer.trace('AgentExecutor->chat', async (chatSpan) => {
      const {
        agentName,
        conversationId,
        requestId,
        isNewConversation,
        content,
        appConfig,
      } = params;
      try {
        chatSpan.setAttributes({
          agentName,
          conversationId,
          requestId,
          isNewConversation,
          content: JSON.stringify(content),
          appConfig: JSON.stringify(params.appConfig),
        });
        chatSpan.setAttributes({
          assignedConversationId: conversationId,
        });
        const chatRequest = await AgentModel.getAgentByName(agentName, {
          conversationId,
          requestId,
          isNewConversation,
          content,
          appConfig,
        });
        const response = await chatRequest.handler();
        const output = {
          ...response,
          requestId,
          conversationId,
        };
        chatSpan.end();
        return output;
      } catch (e) {
        console.log('Error in AgentExecutor.chat', e);
        chatSpan.setStatus({
          code: 1,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        chatSpan.end();
        throw e;
      }
    });
  }
}
