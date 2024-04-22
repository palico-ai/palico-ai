import { AgentNewConversationParams, AgentReplyToConversationParams, AgentResponse } from '@palico-ai/common'

export type ConversationContextParams = Record<string, unknown>

export interface NewConversationParams {
  agentId: string
  userMessage: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: ConversationContextParams
}

export interface ReplyAsUserParams {
  agentId: string
  conversationId: number
  userMessage: string
  context?: ConversationContextParams
}

export interface ToolExecutionMessage {
  functionName: string
  toolId: string
  output: Record<string, unknown>
}

export interface ReplyToToolCallParams {
  conversationId: number
  toolOutputs: ToolExecutionMessage[]
}

export interface NewConversationParams extends AgentNewConversationParams {
  agentId: string
}

export interface ReplyToConversationParams extends AgentReplyToConversationParams {
  agentId: string
  conversationId: number
}

export type ClientNewConversationFN = (params: NewConversationParams) => Promise<AgentResponse>
export type ClientReplyAsUserFN = (params: ReplyToConversationParams) => Promise<AgentResponse>
export type ClientReplyToToolCallFN = (params: ReplyToToolCallParams) => Promise<AgentResponse>

export interface PalicoAgentClient {
  newConversation: ClientNewConversationFN
  replyAsUser: ClientReplyAsUserFN
  replyToToolCall: ClientReplyToToolCallFN
}

export interface AgentMetadata {
  id: string
}

export interface AgentsMetadata {
  getAgentsMetadata: () => Promise<AgentMetadata[]>
}

export interface IPalicoClient {
  agents: PalicoAgentClient
  metadata: AgentsMetadata
}
