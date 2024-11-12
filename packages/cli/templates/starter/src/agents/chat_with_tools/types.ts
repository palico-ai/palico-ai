import { Tool, ToolCall, ToolCallResult } from '@palico-ai/app';

export interface Message {
  role: 'system' | 'user' | 'tool' | 'assistant';
  content?: string;
  toolCalls?: ToolCall[];
  toolCallResult?: ToolCallResult;
}

export interface AgentExecutorResponse {
  finalMessage?: string;
  externalToolCalls?: ToolCall[];
  messages: Message[];
}

export interface AgentExecutorParams {
  tools: Tool[];
  messages: Message[];
  chatCompletion: ChatCompletionFunction;
  onToolCall?: (toolCall: ToolCallWithResult) => void;
  maxSteps?: number;
}

export interface ExecuteToolCallOutput {
  completed: Array<ToolCallResult>;
  failed: Array<ToolCallResult>;
  external: Array<ToolCall>;
}

export interface ToolExecutorParams {
  tools: Tool[];
  toolCalls: ToolCall[];
  onToolCall?: (toolCall: ToolCallWithResult) => void;
}

export interface ToolCallWithResult extends ToolCall {
  result: ToolCallResult['result'];
}

export type ChatCompletionFunction = (params: {
  messages: Message[];
  tools: Tool[];
}) => Promise<Message>;
