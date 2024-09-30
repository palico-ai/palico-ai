import {
  ConversationContext,
  ConversationRequestContent,
  ConversationResponse,
} from '@palico-ai/common';
import { AgentModel } from './model';
import { ConversationTelemetryModel } from '../services/database/conversation_telemetry';
import { getTracer } from '../tracing';

export interface AgentExecutorChatParams {
  agentName: string;
  content: ConversationRequestContent;
  conversationId: string; // For grouping a conversation
  isNewConversation: boolean;
  requestId: string;
  appConfig?: Record<string, unknown>;
  traceId?: string;
}

const tracer = getTracer('AgentExecutor');

export default class AgentExecutor {
  static async chat(
    params: AgentExecutorChatParams
  ): Promise<ConversationResponse> {
    const conversationId = params.conversationId;
    return await tracer.trace('AgentExecutor->chat', async (chatSpan) => {
      const { requestId } = params;
      try {
        chatSpan.setAttributes({
          agentName: params.agentName,
          content: JSON.stringify(params.content, null, 2),
          inputConversationId: params.conversationId,
          appConfig: JSON.stringify(params.appConfig, null, 2),
          traceId: params.traceId,
        });
        chatSpan.setAttributes({
          assignedConversationId: conversationId,
        });
        const traceId = params.traceId || chatSpan.spanContext().traceId;
        const agent = await AgentModel.getAgentByName(params.agentName);
        const context: ConversationContext = {
          conversationId,
          requestId,
          isNewConversation: params.isNewConversation,
          appConfig: params.appConfig ?? {},
          otel: {
            traceId,
          },
        };
        const response = await agent.chat(params.content, context);
        const output = {
          ...response,
          requestId,
          conversationId,
        };
        await ConversationTelemetryModel.logRequest({
          conversationId,
          requestId,
          traceId,
          appConfig: params.appConfig,
          agentName: params.agentName,
          requestInput: params.content,
          responseOutput: output,
        });
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
