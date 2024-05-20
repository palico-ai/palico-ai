import { AgentRequestContent, AgentResponse } from '@palico-ai/common';
import { AgentRequestCreateParams, AgentRequestTable } from '../services/db';
import { uuid } from '../utils/common';
import { trace } from '@opentelemetry/api';
import { getAgentById } from '../utils/api';

const tracer = trace.getTracer('AgentRequestExecutor');

export interface AgentExecutorNewConversation {
  agentId: string;
  content: AgentRequestContent;
  conversationId?: string; // For grouping a conversation
  featureFlags?: Record<string, unknown>;
  traceId?: string;
}

export class AgentRequestExecutor {
  static async logRequest(params: AgentRequestCreateParams) {
    const response = await AgentRequestTable.create({
      id: params.id,
      agentId: params.agentId,
      conversationId: params.conversationId,
      requestTraceId: params.requestTraceId,
    });
    return response.dataValues;
  }

  static async getTracesByConversationId(
    conversationId: string
  ): Promise<string[]> {
    const results = await AgentRequestTable.findAll({
      where: {
        conversationId,
      },
    });
    return results.map((result) => result.dataValues.requestTraceId);
  }

  static async chat(
    params: AgentExecutorNewConversation
  ): Promise<AgentResponse> {
    const result = await tracer.startActiveSpan(
      'AgentRequestExecutor->chat',
      async (span) => {
        const requestId = uuid();
        const {
          agentId,
          content,
          featureFlags = {},
          conversationId = requestId,
          traceId = span.spanContext().traceId,
        } = params;
        const { agent } = getAgentById(agentId);
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
          await this.logRequest({
            id: requestId,
            agentId,
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
