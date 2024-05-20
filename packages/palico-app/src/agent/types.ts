// export interface ToolCallParams {
//   toolId: string;
//   toolName: string;
//   args: Record<string, unknown>;
// }

// export interface ToolCallResult {
//   toolId: string;
//   result: Record<string, unknown>;
// }

import {
  AgentResponse,
  AgentNewConversationRequestBody,
  AgentReplyToConversationRequestBody,
} from '@palico-ai/common';

export interface RequestContext {
  requestId: string;
  otel: {
    traceId: string;
  };
  featureFlags: Record<string, unknown>;
}

export type LLMAgentResponse<D = Record<string, unknown>> = Omit<
  AgentResponse<D>,
  'conversationId'
>;

export interface LLMAgent {
  newConversation: (
    conversationId: string,
    body: AgentNewConversationRequestBody,
    requestContext: RequestContext
  ) => Promise<LLMAgentResponse>;
  replyToConversation: (
    conversationId: string,
    body: AgentReplyToConversationRequestBody,
    requestContext: RequestContext
  ) => Promise<LLMAgentResponse>;
}
