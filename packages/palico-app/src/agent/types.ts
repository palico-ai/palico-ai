import {
  ChatRequestContent,
  ConversationContext,
  ConversationResponse,
} from '@palico-ai/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AgentResponse<D = any> = Omit<
  ConversationResponse<D>,
  'conversationId' | 'requestId'
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Agent<RequestBody = any, Response = any> {
  chat: (
    content: ChatRequestContent<RequestBody>,
    context: ConversationContext
  ) => Promise<AgentResponse<Response>>;
}

export {
  ChatRequestContent as ConversationRequestContent,
  ConversationResponse,
  ConversationContext,
};
