import {
  AgentResponse,
  ConversationRequestContent,
  ConversationContext
} from '@palico-ai/common';

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
    content: ConversationRequestContent<RequestBody>,
    context: ConversationContext
  ) => Promise<LLMAgentResponse<Response>>;
}

export { ConversationRequestContent as AgentRequestContent, AgentResponse as AgentResponse, ConversationContext as AgentRequestContext };