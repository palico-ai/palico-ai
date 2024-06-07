import {
  ConversationRequestContent,
  ConversationResponse,
} from '@palico-ai/common';

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

export interface NewConversationParamsCommon
  extends ConversationRequestContent {
  featureFlags?: Record<string, unknown>;
}

export interface ReplyToConversationParamsCommon
  extends ConversationRequestContent {
  conversationId: string;
  featureFlags?: Record<string, unknown>;
}

export interface ClientNewConversationParams
  extends NewConversationParamsCommon {
  name: string;
}

export interface ClientReplyToConversationParams
  extends ReplyToConversationParamsCommon {
  name: string;
}

export type NewConversationFN = (
  params: ClientNewConversationParams
) => Promise<ConversationResponse>;
export type ReplyAsUserFN = (
  params: ClientReplyToConversationParams
) => Promise<ConversationResponse>;
export type AgentReplyToToolCallFN = (
  params: ReplyToToolCallParams
) => Promise<ConversationResponse>;

export interface PalicoAgentClient {
  newConversation: NewConversationFN;
  replyAsUser: ReplyAsUserFN;
  replyToToolCall: AgentReplyToToolCallFN;
}

export interface WorkflowNewConversationParams
  extends NewConversationParamsCommon {
  workflowId: string;
}

export interface WorkflowReplyToConversationParams
  extends ReplyToConversationParamsCommon {
  workflowId: string;
}

export interface PalicoWorkflowClient {
  newConversation: NewConversationFN;
  replyAsUser: ReplyAsUserFN;
}

export interface IPalicoClient {
  agents: PalicoAgentClient;
  workflows: PalicoWorkflowClient;
}
