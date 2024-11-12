import { logger, Tool } from '@palico-ai/app';
import {
  AgentExecutorParams,
  AgentExecutorResponse,
  ExecuteToolCallOutput,
  ToolExecutorParams,
} from './types';

export const executeTools = async (
  params: ToolExecutorParams
): Promise<ExecuteToolCallOutput> => {
  const toolMap: Record<string, Tool> = {};
  for (const tool of params.tools) {
    toolMap[tool.name] = tool;
  }
  const results: ExecuteToolCallOutput = {
    completed: [],
    failed: [],
    external: [],
  };
  for (const toolCall of params.toolCalls) {
    const tool = toolMap[toolCall.name];
    if (!tool.execute) {
      results.external.push(toolCall);
      continue;
    }
    try {
      const result = await tool.execute(toolCall.parameters ?? {});
      if (params.onToolCall) {
        params.onToolCall({ ...toolCall, result });
      }
      results.completed.push({ id: toolCall.id, result });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      results.failed.push({
        id: toolCall.id,
        result: {
          error: { message: errorMessage },
        },
      });
      if (params.onToolCall) {
        params.onToolCall({ ...toolCall, result: { error: errorMessage } });
      }
    }
  }
  return results;
};

export const agentExecutor = async (
  params: AgentExecutorParams
): Promise<AgentExecutorResponse> => {
  const { messages: message, maxSteps = 5, tools, onToolCall } = params;
  const messageHistory = [...message];
  for (let i = 0; i < maxSteps; i++) {
    const responseMessage = await params.chatCompletion({
      messages: messageHistory,
      tools,
    });
    messageHistory.push(responseMessage);
    const { toolCalls, content } = responseMessage;
    if (toolCalls?.length && toolCalls.length > 0) {
      const toolResponse = await executeTools({
        tools,
        toolCalls,
        onToolCall,
      });
      if (toolResponse.failed.length > 0) {
        console.log('Failed to execute tool', toolResponse.failed);
        throw new Error('Failed to execute tool');
      }
      toolResponse.completed.forEach((result) => {
        messageHistory.push({
          role: 'tool',
          toolCallResult: {
            id: result.id,
            result: result.result,
          },
        });
      });
      if (toolResponse.external.length > 0) {
        return {
          externalToolCalls: toolResponse.external,
          messages: messageHistory,
        };
      }
    } else {
      if (!content) {
        logger.log('No message in response', content);
        throw new Error('No message in response');
      }
      return {
        finalMessage: content,
        messages: messageHistory,
      };
    }
  }
  throw new Error('Max steps reached');
};
