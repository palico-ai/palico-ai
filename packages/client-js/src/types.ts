import { ConversationRequestContent, ConversationResponse } from '@palico-ai/common';

export type ConversationContextParams = Record<string, unknown>;

export interface ReplyAsUserParams {
  agentId: string;
  conversationId: string;
  userMessage: string;
  context?: ConversationContextParams;
}

export interface ToolExecutionMessage {
  functionName: string;
  toolId: string;
  output: Record<string, unknown>;
}

export interface ReplyToToolCallParams {
  conversationId: string;
  toolOutputs: ToolExecutionMessage[];
}

export interface NewConversationParams extends ConversationRequestContent {
  agentId: string;
  featureFlags?: Record<string, unknown>;
}

export interface ReplyToConversationParams extends ConversationRequestContent {
  agentId: string;
  conversationId: string;
  featureFlags?: Record<string, unknown>;
}

export type ClientNewConversationFN = (
  params: NewConversationParams
) => Promise<ConversationResponse>;
export type ClientReplyAsUserFN = (
  params: ReplyToConversationParams
) => Promise<ConversationResponse>;
export type ClientReplyToToolCallFN = (
  params: ReplyToToolCallParams
) => Promise<ConversationResponse>;

export interface PalicoAgentClient {
  newConversation: ClientNewConversationFN;
  replyAsUser: ClientReplyAsUserFN;
  replyToToolCall: ClientReplyToToolCallFN;
}

export interface IPalicoClient {
  agents: PalicoAgentClient;
}
