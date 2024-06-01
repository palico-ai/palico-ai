import {
  ConversationRequestContent,
  ConversationContext,
  ConversationResponse
} from '@palico-ai/common';

export type LLMAgentResponse<D = Record<string, unknown>> = Omit<
  ConversationResponse<D>,
  'conversationId' | 'requestId'
>;

export interface LLMAgent<
  RequestBody = Record<string, unknown>,
  Response = Record<string, unknown>
> {
  chat: (
    content: ConversationRequestContent<RequestBody>,
    context: ConversationContext
  ) => Promise<LLMAgentResponse<Response>>;
}

export {
  ConversationRequestContent,
  ConversationResponse,
  ConversationContext,
};
