// export interface ToolCallParams {
//   toolId: string;
//   toolName: string;
//   args: Record<string, unknown>;
// }

// export interface ToolCallResult {
//   toolId: string;
//   result: Record<string, unknown>;
// }

export interface AgentResponse<Data = Record<string, unknown>> {
  conversationId: number;
  message?: string;
  // toolCalls?: ToolCallParams[];
  data?: Data;
}

export interface ChatCompletionMessageInput {
  userMessage: string;
  context?: Record<string, unknown>;
}

export type ReplyToConversationParams = {
  userMessage?: string;
  toolOutputs?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface LLMAgent {
  newConversation: (
    params: ChatCompletionMessageInput
  ) => Promise<AgentResponse>;
  replyToConversation: (
    conversationId: number,
    params: ReplyToConversationParams
  ) => Promise<AgentResponse>;
}