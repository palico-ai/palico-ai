import { SpanStatusCode } from '@opentelemetry/api';
import { ChatHistory, getTracer, Logger } from '@palico-ai/app';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface OpenAIServiceConversationParams {
  conversationId: string;
  message: string;
  model: string;
}

export interface NewConversationParams extends OpenAIServiceConversationParams {
  systemMessage?: string;
}

const tracer = getTracer('OpenAIService');

export class OpenAIService {
  static async newConversation(params: NewConversationParams) {
    return tracer.trace('OpenAIService.newConversation', async (span) => {
      try {
        const { conversationId, systemMessage, message, model } = params;
        if (!message) {
          throw new Error('message is required');
        }
        const historyDB =
          await ChatHistory.fromConversation<ChatCompletionMessageParam>({
            conversationId,
          });
        historyDB
          .append({
            role: 'system',
            content: systemMessage || 'Hello, how can I help you today?',
          })
          .append({
            role: 'user',
            content: message,
          });
        const openaiClient = await OpenAIService.getOpenAIClient();
        const response = await openaiClient.chat.completions.create({
          model: model,
          temperature: 0,
          messages: historyDB.messages,
        });
        historyDB.append(response.choices[0].message);
        await historyDB.save();
        const openaiResponseMessage = response.choices[0].message
          .content as string;
        span.setAttributes({
          openaiResponseMessage,
          promptHistory: JSON.stringify(historyDB.messages, null, 2),
        });
        return {
          message: openaiResponseMessage,
        };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'An error occurred',
        });
        Logger.log('Error:', error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  static async replyToConversation(params: OpenAIServiceConversationParams) {
    return tracer.trace('OpenAIService.replyToConversation', async (span) => {
      try {
        const { conversationId, message, model } = params;
        const historyDB =
          await ChatHistory.fromConversation<ChatCompletionMessageParam>({
            conversationId,
          });
        historyDB.append({
          role: 'user',
          content: message,
        });
        const openaiClient = await OpenAIService.getOpenAIClient();
        const response = await openaiClient.chat.completions.create({
          model: model,
          temperature: 0,
          messages: historyDB.messages,
        });
        historyDB.append(response.choices[0].message);
        const openaiResponseMessage = response.choices[0].message
          .content as string;
        await historyDB.save();
        span.setAttributes({
          openaiResponseMessage,
          promptHistory: JSON.stringify(historyDB.messages, null, 2),
        });
        return {
          message: openaiResponseMessage,
        };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'An error occurred',
        });
        Logger.log('Error:', error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  static async getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
