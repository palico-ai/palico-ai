import { LLMAgent } from '@palico-ai/app';
import { OpenAIConversation } from './services/openai';
import {
  AgentNewConversationRequestBody,
  AgentReplyToConversationRequestBody,
  AgentResponse,
} from '@palico-ai/common';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('conversational-agent');

export type AgentResponseData = Record<string, unknown>;

export class ConversationalAgent implements LLMAgent {
  static agentId = "v1"

  async newConversation(
    conversationId: string,
    params: AgentNewConversationRequestBody,
  ): Promise<AgentResponse<AgentResponseData>> {
    return tracer.startActiveSpan('Agent New Conversation', async (span) => {
      console.log("Trace ID: " +  span.spanContext().traceId)
      span.addEvent('Calling OpenAIConversation.newConversation');
      const conversation = await OpenAIConversation.newConversation({
        conversationId,
        systemPrompt: 'You are a helpful assistant',
      });
      const response = await conversation.sendUserMessage(params.userMessage);
      span.setAttribute('conversationId', response.conversationId.toString());
      span.end();
      return response;
    });
  }

  async replyToConversation(
    conversationId: string,
    params: AgentReplyToConversationRequestBody
  ): Promise<AgentResponse<AgentResponseData>> {
    const conversation = await OpenAIConversation.fromConversationId(
      conversationId
    );
    console.log(params);
    if (!params.userMessage) {
      throw new Error('userMessage is required');
    }
    const response = await conversation.sendUserMessage(params.userMessage);
    return response;
  }
}
