import type OpenAI from 'openai'

export type OpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  function_call?: OpenAI.Chat.ChatCompletionMessage['function_call']
}

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export interface AgentCallResponse {
  finishReason: OpenAI.Chat.ChatCompletion.Choice['finish_reason']
  message: AgentMessage
  conversationId: number
}

export interface NewConversationParams {
  message: string
  context?: Record<string, unknown>
}

export interface ReplyAsUserParams {
  conversationId: number
  message: string
  context?: Record<string, unknown>
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

export type ClientNewConversationFN = (params: NewConversationParams) => Promise<AgentCallResponse>
export type ClientReplyAsUserFN = (params: ReplyAsUserParams) => Promise<AgentCallResponse>
export type ClientReplyToToolCallFN = (params: ReplyToToolCallParams) => Promise<AgentCallResponse>

export interface IPalicoClient {
  newConversation: ClientNewConversationFN
  replyAsUser: ClientReplyAsUserFN
  replyToToolCall: ClientReplyToToolCallFN
}
