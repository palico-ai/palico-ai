import { trace } from "@opentelemetry/api";
import { ConversationContext, ConversationRequestContent, ConversationResponse } from "@palico-ai/common";
import { uuid } from "../utils/common";
import { AgentModel } from "./model";
import { ConversationTracker } from "../services/database/conversation_tracker";

export interface AgentExecutorChatParams {
  agentName: string;
  content: ConversationRequestContent;
  conversationId?: string; // For grouping a conversation
  featureFlags?: Record<string, unknown>;
  traceId?: string;
}

const tracer = trace.getTracer('AgentExecutor');

export default class AgentExecutor {
  static async chat(params: AgentExecutorChatParams): Promise<ConversationResponse> {
    return await tracer.startActiveSpan('AgentExecutor->chat', async (chatSpan) => {
      try {
        chatSpan.setAttributes({
          agentName: params.agentName,
          content: JSON.stringify(params.content, null, 2),
          conversationId: params.conversationId,
          featureFlags: JSON.stringify(params.featureFlags, null, 2),
          traceId: params.traceId,
        });
        const conversationId = params.conversationId || uuid();
        const requestId = uuid();
        const traceId = params.traceId || chatSpan.spanContext().traceId;
        const agent = await AgentModel.getAgentByName(params.agentName);
        const context: ConversationContext = {
          conversationId,
          requestId,
          featureFlags: params.featureFlags ?? {},
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
        await ConversationTracker.logRequest({
          conversationId,
          requestId,
          traceId,
          agentName: params.agentName,
          requestInput: params.content,
          responseOutput: output,
        });
        return output;
      } catch (e) {
        chatSpan.setStatus({
          code: 1,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        throw e;
      } finally {
        chatSpan.end();
      }
    });
  }
}
