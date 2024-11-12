import OpenAI from 'openai';
import { ChatCompletionFunction, Message } from './types';
import { logger, Tool } from '@palico-ai/app';
import zodToJsonSchema from 'zod-to-json-schema';

export interface CallOpenAIParams {
  messages: Message[];
  tools: Tool[];
}

const toOpenAIMessage = (
  message: Message
): OpenAI.Chat.ChatCompletionMessageParam => {
  const { role, content, toolCalls, toolCallResult } = message;
  switch (role) {
    case 'user':
      if (!content) {
        throw new Error('User message must have content');
      }
      return {
        role: 'user',
        content: content,
      };
    case 'system':
      if (!content) {
        throw new Error('System message must have content');
      }
      return {
        role: 'system',
        content: content,
      };
    case 'tool':
      if (!toolCallResult || !toolCallResult.id) {
        throw new Error('Tool message must have toolCallResults and id');
      }
      return {
        role: 'tool',
        tool_call_id: toolCallResult.id,
        content: JSON.stringify(toolCallResult.result),
      };
    case 'assistant':
      if (content) {
        return {
          role: 'assistant',
          content: content,
        };
      } else if (toolCalls) {
        return {
          role: 'assistant',
          tool_calls: toolCalls?.map((toolcall) => ({
            id: toolcall.id,
            type: 'function',
            function: {
              name: toolcall.name,
              arguments: JSON.stringify(toolcall.parameters),
            },
          })),
        };
      } else {
        throw new Error('Assistant message must have content or toolCalls');
      }
    default:
      throw new Error('Invalid role');
  }
};

const toPalicoMessage = (
  message: OpenAI.Chat.ChatCompletionMessage
): Message => {
  return {
    role: message.role,
    toolCalls: message.tool_calls?.map((toolCall) => ({
      id: toolCall.id,
      name: toolCall.function.name,
      parameters: toolCall.function.arguments
        ? JSON.parse(toolCall.function.arguments)
        : undefined,
    })),
    content: message.content ?? undefined,
  };
};

const formatTools = (tools: Tool[]): OpenAI.Chat.ChatCompletionTool[] => {
  return tools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
        ? zodToJsonSchema(tool.parameters)
        : undefined,
    },
  }));
};

export const openaiChatCompletion: ChatCompletionFunction = async (params) => {
  logger.info('Calling OpenAI chat completion');
  logger.info('Messages', params.messages);
  const { messages } = params;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
  }
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: messages.map(toOpenAIMessage),
    tools: formatTools(params.tools),
    max_tokens: 2000,
  });
  const message = toPalicoMessage(response.choices[0].message);
  return message;
};
