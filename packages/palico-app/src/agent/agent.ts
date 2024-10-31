import {
  AgentRequestContext,
  AgentRequestContent,
  AgentResponse,
} from '@palico-ai/common';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../tracing/internal.span';
import { ResponseMetadataKey } from '../types';
import { getTracer, Logger } from '../tracing';
import { ConversationTelemetryModel } from '../services/database/conversation_telemetry';
import { LogQueue } from '../tracing/logger/log_queue';
import { NewChatRequestParams } from './chat';
import { AgentModel } from './model';
import { ChatResponseStream, ChatResponseStreamOptions } from './chat/stream';

export interface AgentChatRequest
  extends Omit<
    NewChatRequestParams,
    'conversationId' | 'requestId' | 'isNewConversation'
  > {
  agentName: string;
  conversationId?: string;
  /**
   * Stream response -- can be set optionally, otherwise the response will be returned
   */
  onStreamContentPush?: ChatResponseStreamOptions['onPush'];
}

interface ChatExecutorParams extends AgentChatRequest {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
}

const tracer = getTracer('AgentExecutor');

/**
 * IDEA:
 * We always need the AgentResponse at the end of the chat. As such, it shoud
 * always return the AgentResponse. Additionally, developers can pass in a
 * function for on push, which will be called whenever a new message is streamed
 * For example, express can pass in a function to write to the response stream
 */

export class Agent {
  static async chat(params: AgentChatRequest): Promise<AgentResponse> {
    const conversationId = params.conversationId ?? uuid();
    const requestId = uuid();
    let output: AgentResponse;
    return await startConversationSpan(
      conversationId,
      requestId,
      'Application.chat',
      async () => {
        try {
          const startTime = performance.now();
          const response = await Agent.executeChat({
            ...params,
            conversationId,
            requestId,
            isNewConversation: !params.conversationId,
          });
          const endTime = performance.now();
          output = response;
          return {
            ...response,
            metadata: {
              ...response.metadata,
              [ResponseMetadataKey.ExecutionTime]: endTime - startTime,
            },
          };
        } catch (e) {
          if (e instanceof Error) {
            const stackTrace = e.stack;
            Logger.error('Application.chat', e.message, stackTrace);
          }
          throw e;
        } finally {
          console.log('Logging request');
          await ConversationTelemetryModel.logRequest({
            conversationId,
            requestId,
            appConfig: params.appConfig,
            agentName: params.agentName,
            requestInput: params.content,
            responseOutput: output ?? { messages: [] },
          });
          console.log('Flushing logs and spans');
          await LogQueue.tryFlushingLogs(requestId);
        }
      }
    );
  }

  /**
   * Retrived the agent by name and executes the chat
   */
  private static async executeChat(
    params: ChatExecutorParams
  ): Promise<AgentResponse> {
    return await tracer.trace('AgentExecutor->chat', async (chatSpan) => {
      const {
        agentName,
        conversationId,
        requestId,
        isNewConversation,
        content,
        appConfig,
      } = params;
      try {
        chatSpan.setAttributes({
          agentName,
          conversationId,
          requestId,
          isNewConversation,
          content: JSON.stringify(content),
          appConfig: JSON.stringify(params.appConfig),
        });
        chatSpan.setAttributes({
          assignedConversationId: conversationId,
        });
        const chatRequest = await AgentModel.getAgentByName(agentName, {
          conversationId,
          requestId,
          isNewConversation,
          content,
          appConfig,
        });
        const stream = new ChatResponseStream(conversationId, requestId, {
          onPush: params.onStreamContentPush,
        });
        const response = await chatRequest.handler(stream);
        if (response === undefined) {
          if (stream.chunks.length === 0) {
            throw new Error('No response');
          }
          return await stream.resolveContent();
        }
        return {
          ...response,
          conversationId,
          requestId,
        };
      } catch (e) {
        console.log('Error in AgentExecutor.chat', e);
        chatSpan.setStatus({
          code: 1,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        throw e;
      }
    });
  }
}

export { AgentRequestContent, AgentRequestContext, AgentResponse };
