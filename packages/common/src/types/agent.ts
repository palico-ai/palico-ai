import { JSONAbleObject } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AgentResponseMetadata = Record<string, any>;

export interface ToolCall {
  id: string;
  name: string;
  arguments?: JSONAbleObject;
}

export interface ToolCallResult {
  id: string;
  result?: JSONAbleObject;
}

export interface IntermediateStep {
  name: string;
  data?: JSONAbleObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
  toolCalls?: ToolCall[];
  intermediateSteps?: IntermediateStep[];
  metadata?: AgentResponseMetadata;
}

export interface AgentResponseChunkDelta {
  message?: string;
  data?: any;
  toolCalls?: ToolCall[];
  intermediateSteps?: IntermediateStep[];
}

export interface AgentResponseChunk {
  conversationId: string;
  requestId: string;
  delta: AgentResponseChunkDelta;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentRequestContent<Payload = Record<string, any>> {
  /**
   * For chat-based agents, this is the user message.
   */
  userMessage?: string;
  /**
   * Additional data that can be passed to the agent.
   */
  payload?: Payload;
  /**
   * For client-sided tools, this can be used to notify
   * the result of the tool call.
   * E.g. If the previous agent call response was:
   * {
   *  toolCalls: [
   *   { id: '1', name: 'getWeather', arguments: { ... } },
   * }
   * Then when the client-side tool is executed, you can call the agent with:
   * {
   * toolCallResults: [
   *  { id: '1', result: { ... } }
   * ]
   */
  toolCallResults?: ToolCallResult[];
}

export interface AgentRequestContext<AC = JSONAbleObject> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  appConfig: AC;
}
