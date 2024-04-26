import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import ConversationHistory from '../tables/conversation_history';
import { AgentResponse } from '@palico-ai/common';
import { SpanStatusCode, trace } from '@opentelemetry/api';

interface OpenAINewConversationParams {
  conversationId: string;
  systemPrompt: string;
}

interface ConversationConstructorParams {
  history: ChatCompletionMessageParam[];
  conversationId: string;
}

export type OpenAICallResponse = Omit<AgentResponse, 'data'>;

const tracer = trace.getTracer('openai-conversation');

export class OpenAIConversation {
  private client: OpenAI;
  private history: OpenAI.Chat.ChatCompletionMessageParam[];
  private conversationId: string;

  private constructor(params: ConversationConstructorParams) {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }
    this.client = new OpenAI({
      apiKey,
    });
    this.history = params.history;
    this.conversationId = params.conversationId;
  }

  private async call(
    messages: ChatCompletionMessageParam[]
  ): Promise<OpenAICallResponse> {
    return tracer.startActiveSpan('OpenAI Call', async (span) => {
      const isNewConversation = this.history.length === 1;
      const newHistory = [...this.history, ...messages];
      span.addEvent('Calling OpenAI Endpoint');
      span.setAttribute("messages", JSON.stringify(newHistory, null, 2));
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: newHistory,
        stream: false,
      });
      this.history = newHistory;
      if (!isNewConversation) {
        await ConversationHistory.updateConversationHistory(
          this.conversationId,
          this.history
        );
      } else {
        span.addEvent('Creating new conversation');
        const conversation = await ConversationHistory.createConversation({
          conversationId: this.conversationId,
          agentId: 'openai',
          history: this.history,
        });
        this.conversationId = conversation.id;
      }
      const responseMessage = response.choices[0].message;
      if (!responseMessage || !responseMessage.content) {
        const error = new Error('No response message');
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR })
        span.end();
        throw error
      }
      span.end();
      return {
        conversationId: this.conversationId,
        message: responseMessage.content,
      };
    });
  }

  async sendUserMessage(message: string): Promise<OpenAICallResponse> {
    return this.call([
      {
        role: 'user',
        content: message,
      },
    ]);
  }

  static async newConversation(
    params: OpenAINewConversationParams
  ): Promise<OpenAIConversation> {
    return tracer.startActiveSpan(
      'Creating new OpenAI Conversation',
      (span) => {
        const response = new OpenAIConversation({
          conversationId: params.conversationId,
          history: [
            {
              role: 'system',
              content: params.systemPrompt,
            },
          ],
        });
        span.end();
        return response;
      }
    );
  }

  static async fromConversationId(
    conversationId: string
  ): Promise<OpenAIConversation> {
    const conversation = await ConversationHistory.getConversation(
      conversationId
    );
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return new OpenAIConversation({
      history: conversation.history,
      conversationId,
    });
  }
}
