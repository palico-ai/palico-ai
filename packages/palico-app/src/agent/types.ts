// export interface ToolCallParams {
//   toolId: string;
//   toolName: string;
//   args: Record<string, unknown>;
// }

// export interface ToolCallResult {
//   toolId: string;
//   result: Record<string, unknown>;
// }



import {
  AgentResponse,
  AgentNewConversationParams,
  AgentReplyToConversationParams
} from "@palico-ai/common"

export interface LLMAgent {
  newConversation: (
    params: AgentNewConversationParams
  ) => Promise<AgentResponse>;
  replyToConversation: (
    conversationId: number,
    params: AgentReplyToConversationParams
  ) => Promise<AgentResponse>;
}