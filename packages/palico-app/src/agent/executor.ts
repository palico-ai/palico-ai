import {
  ConversationContext,
  ChatRequestContent,
  ConversationResponse,
} from '@palico-ai/common';
import { AgentModel } from './model';
import { getTracer } from '../telemetry';

export interface AgentExecutorChatParams {
  agentName: string;
  content: ChatRequestContent;
  conversationId: string; // For grouping a conversation
  isNewConversation: boolean;
  requestId: string;
  appConfig?: Record<string, unknown>;
  traceId?: string; // @deprecated
}

const tracer = getTracer('AgentExecutor');

export default class AgentExecutor {
  static async chat(
    params: AgentExecutorChatParams
  ): Promise<ConversationResponse> {
    return await tracer.trace('AgentExecutor->chat', async (chatSpan) => {
      const { requestId, conversationId } = params;
      try {
        chatSpan.setAttributes({
          agentName: params.agentName,
          content: JSON.stringify(params.content, null, 2),
          appConfig: JSON.stringify(params.appConfig, null, 2),
        });
        const agent = await AgentModel.getAgentByName(params.agentName);
        const context: ConversationContext = {
          conversationId,
          requestId,
          isNewConversation: params.isNewConversation,
          appConfig: params.appConfig ?? {},
        };
        const response = await agent.chat(params.content, context);
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
