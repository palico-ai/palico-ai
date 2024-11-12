import { Chat, ChatHandlerResponse, getTracer, logger } from '@palico-ai/app';
import { AppConfig } from '../types';
import { getOpenAIClient } from '../../utils/openai';

const tracer = getTracer('ChatbotAgent');

/**
 * This is a simple chat agent that can:
 * - can use any openai model through the appConfig
 * - provides logs and traces for better observability
 */
const handler: Chat<unknown, undefined | AppConfig> = async ({
  userMessage,
  appConfig,
}): Promise<ChatHandlerResponse> => {
  return await tracer.trace('ChatbotAgent->chat', async (span) => {
    // Adding traces for better observability and debugging
    span.setAttributes({
      message: userMessage,
      model: appConfig?.model,
    });

    logger.log('Creating message history for LLM Model');
    if (!userMessage) throw new Error('User message is required');
    const responseMessage = await callOpenAI(
      userMessage,
      appConfig?.model ?? 'gpt-3.5-turbo-0125'
    );

    logger.log('Returning response to the client');
    if (!responseMessage) {
      throw new Error('No response message from OpenAI');
    }
    return {
      message: responseMessage,
    };
  });
};

const callOpenAI = async (userMessage: string, model: string) => {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'Your response must be in markdown format',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  return response.choices[0].message.content;
};

export default handler;
