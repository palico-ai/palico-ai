import OpenAI from "openai"

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export interface AgentCallResponse {
  finishReason: OpenAI.Chat.ChatCompletion.Choice['finish_reason']
  message: AgentMessage
}

export type AgentResponse = AgentCallResponse & {
  conversationId: number
}

// TODO: Update tool_calls to be toolCalls
// TODO: Update this to be more generic
export type OpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam
