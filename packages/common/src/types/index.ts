import OpenAI from 'openai';

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role'];
  content: OpenAI.Chat.ChatCompletionMessageParam['content'];
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls'];
}

export interface AgentResponse<Data = Record<string, unknown>> {
  conversationId: string;
  message?: string;
  // toolCalls?: ToolCallParams[];
  data?: Data;
}

export interface AgentRequestContent<Payload = Record<string, unknown>> {
  userMessage?: string;
  payload?: Payload;
}

export * from './studio';
