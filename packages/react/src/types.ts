import { IntermediateStep, JSONAbleObject, ToolCall } from '@palico-ai/common';

export enum MessageSender {
  User = 'user',
  Agent = 'agent',
}

export interface UserMessage {
  sender: MessageSender.User;
  message?: string;
  data?: JSONAbleObject;
  appConfig?: JSONAbleObject;
  toolCallResults?: ToolCallWithResult[];
}

export interface AgentMessage {
  sender: MessageSender.Agent;
  requestId: string;
  message?: string;
  data?: JSONAbleObject;
  toolCalls?: ToolCall[];
  intermediateSteps?: IntermediateStep[];
}

export type Message = UserMessage | AgentMessage;

export interface ToolCallWithResult {
  toolCall: ToolCall;
  result: JSONAbleObject;
}

export interface ChatSendMessageParams {
  userMessage?: string;
  payload?: any;
  appConfig?: JSONAbleObject;
}

export interface ChatError {
  message: string;
}

export interface UseChatParams {
  /**
   * The API URL that proxies request to `client.agent.chat()`.
   */
  apiURL: string;
  /**
   * The name of the agent to chat with.
   */
  agentName: string;
  /**
   * Initial state of the chat. This is useful for rehydrating the chat state
   */
  initialState?: {
    messages: Message[];
    conversationId: string;
  };
}

/**
 * Represents the return type of the `useChat` hook.
 */
export type UseChatReturn = {
  /**
   * An array of messages in the chat. This includes messages from the user and the agent.
   * The messages are ordered chronologically and often used to render the chat history.
   */
  messages: Message[];

  /**
   * Indicates whether a chat operation is in progress.
   */
  loading: boolean;

  /**
   * An optional error object if an error occurred during a chat operation.
   * The error object contains a message that describes the error.
   */
  error?: ChatError;

  /**
   * An optional ID of the current conversation.
   * If no conversation is active, this value is `undefined`.
   */
  conversationId?: string;

  /**
   * An array of pending tool calls.
   * This array contains tool calls that are waiting for results.
   * As the results are added to the tool calls, they are removed from this array.
   */
  pendingToolCalls: ToolCall[];

  /**
   * Adds a result to a specific tool call.
   *
   * @param toolCall - The tool call to which the result will be added.
   * @param result - The result to add to the tool call.
   */
  addResult: (toolCall: ToolCall, result: JSONAbleObject) => void;

  /**
   * The name of the agent handling the chat.
   */
  agentName: string;

  /**
   * Starts a new conversation with the current agent.
   * This operation is useful when you want to reset the chat history.
   */
  startNewConversation: () => void;

  /**
   * Sends a message to the agent.
   *
   * @param params - The parameters for sending the message.
   */
  sendMessage: (params: ChatSendMessageParams) => Promise<void>;
};
