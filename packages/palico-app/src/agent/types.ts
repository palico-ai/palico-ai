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
  AgentRequestContent,
} from '@palico-ai/common';

export interface AgentRequestContext {
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

export interface LLMAgent<
  RequestBody = Record<string, unknown>,
  Response = Record<string, unknown>
> {
  chat: (
    conversationId: string,
    content: AgentRequestContent<RequestBody>,
    context: AgentRequestContext
  ) => Promise<LLMAgentResponse<Response>>;
}
