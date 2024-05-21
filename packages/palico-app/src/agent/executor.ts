import { ConversationRequestContent, AgentResponse } from '@palico-ai/common';
import { uuid } from '../utils/common';
import { trace } from '@opentelemetry/api';
import { AgentModel } from './model';

const tracer = trace.getTracer('agent-executor');

export interface AgentExecutorChatParams {
  agentName: string;
  content: ConversationRequestContent;
  conversationId?: string; // For grouping a conversation
  featureFlags?: Record<string, unknown>;
  traceId?: string;
}

export class AgentExecutor {

  static async chat(
    params: AgentExecutorChatParams
  ): Promise<AgentResponse> {
    const result = await tracer.startActiveSpan(
      'AgentRequestExecutor->chat',
      async (span) => {
        const requestId = uuid();
        const {
          agentName,
          content,
          featureFlags = {},
          conversationId = requestId,
          traceId = span.spanContext().traceId,
        } = params;
        const agent = await AgentModel.getAgentByName(agentName);
        try {
          const agentResponse = await tracer.startActiveSpan(
            'Executing User Agent',
            async (agentCallerSpan) => {
              const response = await agent.chat(conversationId, content, {
                requestId,
                otel: {
                  traceId: traceId,
                },
                featureFlags,
              });
              agentCallerSpan.end();
              return response;
            }
          );
          await AgentModel.logRequest({
            id: requestId,
            agentId: agentName,
            conversationId,
            requestTraceId: traceId,
          });
          span.end();
          return {
            ...agentResponse,
            conversationId,
          };
        } catch (e) {
          const message = e instanceof Error ? e.message : 'An error occurred';
          span.setStatus({
            code: 1,
            message: message,
          });
          span.end();
          throw e;
        }
      }
    );
    return result;
  }
}
