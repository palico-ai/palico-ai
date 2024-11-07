import { AnyZodObject } from 'zod';
import { JSONAbleObject } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AgentResponseMetadata = Record<string, any>;

/**
 * Simple interface used to define a tool.
 */
export interface Tool<Input = JSONAbleObject, Output = JSONAbleObject> {
  /**
   * Name of the function / tool.
   */
  name: string;
  /**
   * Description of the tool does. This is often passed to your LLM.
   */
  description?: string;
  /**
   * Schema for the input to your tool.
   */
  parameters?: AnyZodObject;
  /**
   * Function that is executed when the tool is called
   * @param args - Input parameters to the tool
   * @returns Output of the tool
   */
  execute?: (args: Input) => Promise<Output>;
}

/**
 * For Agentic Applications, the tool call that needs to be executed
 */
export interface ToolCall {
  /**
   * Unique ID associated with the tool call.
   */
  id: string;
  /**
   * Name of the tool that needs to be executed.
   */
  name: string;
  /**
   * Parameters that need to be passed to the tool.
   */
  parameters?: JSONAbleObject;
}

/**
 * Result from executing a tool call.
 */
export interface ToolCallResult {
  /**
   * ID of the tool call that was executed.
   */
  id: string;
  /**
   * Result of the tool call.
   */
  result?: JSONAbleObject;
}

/**
 * Intermediate step that the agent has taken.
 */
export interface IntermediateStep {
  /**
   * Name/Description of the step.
   */
  name: string;
  /**
   * Additional data related to the step.
   */
  data?: JSONAbleObject;
}

export interface AgentResponseCommon<Data = JSONAbleObject> {
  /**
   * Message to be sent back to the client.
   */
  message?: string;
  /**
   * Additional data that can be sent back to the client.
   */
  data?: Data;
  /**
   * Tool calls that needs to be executed on the client-side.
   */
  toolCalls?: ToolCall[];
  /**
   * Intermediate steps that the agent has taken.
   * This can be used for debugging or logging purposes, or to provide
   * additional context to the client.
   */
  intermediateSteps?: IntermediateStep[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentResponse<Data = Record<string, any>>
  extends AgentResponseCommon<Data> {
  /**
   * ID of the conversation associated with the response.
   */
  conversationId: string;
  /**
   * Unique ID associated with the request.
   */
  requestId: string;
  /**
   * Additional metadata that you want to log with the response.
   * Often used for tagging metrics data.
   */
  metadata?: AgentResponseMetadata;
}

/**
 * Stream chunk that is sent back to the client.
 */
export type AgentResponseChunkDelta<Data = JSONAbleObject> =
  AgentResponseCommon<Data>;

export interface AgentResponseChunk {
  /**
   * ID of the conversation associated with the response.
   */
  conversationId: string;
  /**
   * Unique ID associated with the request.
   */
  requestId: string;
  /**
   * New chunk of data being sent from stream
   */
  delta: AgentResponseChunkDelta;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentRequestContent<Payload = Record<string, any>> {
  /**
   * For chat-based agents, this is the user message sent from the client.
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
   *   { id: '1', name: 'getWeather', parameters: { ... } },
   * }
   * Then when the client-side tool is executed, you can call the agent with:
   * {
   * toolCallResults: [
   *  { id: '1', result: { ... } }
   * ]
   */
  toolCallResults?: ToolCallResult[];
}

/**
 * Contextual information about the request.
 */
export interface AgentRequestContext<AC = JSONAbleObject> {
  /**
   * Conversation ID associated with the request. For conversational applications,
   * multiple requests can be associated with the same conversation.
   */
  conversationId: string;
  /**
   * Unique request ID associated with the request.
   */
  requestId: string;
  /**
   * Flag to indicate if the current request is a new conversation.
   */
  isNewConversation: boolean;
  /**
   * Additional configuration that can be passed from the client to the agent.
   * This can be used to pass feature-flags or other configuration values.
   * E.g. {
   *    model: 'gpt-3.5-turbo-0125',
   *    promptVersion: "chain-of-thought",
   * }
   */
  appConfig: AC;
}
