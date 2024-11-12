import { Chat, ChatHandlerResponse, getTracer } from '@palico-ai/app';
import OpenAI from 'openai';

const tracer = getTracer('ChatbotAgent');

// config value / feature-flags that can be passed to the agent
interface AppConfig {
  model?: string;
}

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
    if (!userMessage) throw new Error('User message is required');

    // Calling OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await client.chat.completions.create({
      model: appConfig?.model ?? 'gpt-3.5-turbo-0125',
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

    // return the response to the client
    const responseMessage = response.choices[0].message.content;
    if (!responseMessage) {
      throw new Error('No response message from OpenAI');
    }
    return {
      message: response.choices[0].message.content ?? '',
    };
  });
};

export default handler;
