import OpenAI from "openai"

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export interface AgentResponse<Data = Record<string, unknown>> {
  conversationId: number;
  message?: string;
  // toolCalls?: ToolCallParams[];
  data?: Data;
}

export interface AgentNewConversationParams {
  userMessage: string;
  context?: Record<string, unknown>;
}

export type AgentReplyToConversationParams = {
  userMessage?: string;
  toolOutputs?: Record<string, unknown>;
  context?: Record<string, unknown>;
}