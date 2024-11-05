import { AgentRequestContent, AgentResponse } from '@palico-ai/common';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../tracing/internal.span';
import { ResponseMetadataKey } from '../types';
import { getTracer, logger } from '../tracing';
import { ConversationTelemetryModel } from '../services/database/conversation_telemetry';
import { LogQueue } from '../tracing/logger/log_queue';
import { ChatRequest } from './chat';
import { AgentModel } from './model';
import { ChatResponseStream, ChatResponseStreamOptions } from './chat/stream';

export interface AgentChatRequest
  extends Omit<
    ChatRequest,
    'conversationId' | 'requestId' | 'isNewConversation' | 'stream'
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
          console.log('Starting chat', params);
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
            logger.error('Application.chat', e.message, stackTrace);
          }
          throw e;
        } finally {
          console.log('Logging request');
          await ConversationTelemetryModel.logRequest({
            conversationId,
            requestId,
            appConfig: params.appConfig,
            agentName: params.agentName,
            requestInput: {
              userMessage: params.userMessage,
              payload: params.payload,
              toolCallResults: params.toolCallResults,
            },
            responseOutput: output ?? {},
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
        userMessage,
        payload,
        toolCallResults,
        appConfig,
      } = params;
      try {
        chatSpan.setAttributes({
          agentName,
          conversationId,
          requestId,
          isNewConversation,
          userMessage,
          payload: JSON.stringify(payload),
          appConfig: JSON.stringify(params.appConfig),
        });
        chatSpan.setAttributes({
          assignedConversationId: conversationId,
        });
        const chatRequestHandler = await AgentModel.getAgentByName(agentName);
        const stream = new ChatResponseStream(conversationId, requestId, {
          onPush: params.onStreamContentPush,
        });
        console.log(`ChatRequestHandler: ${chatRequestHandler}`);
        const response = await chatRequestHandler({
          stream,
          conversationId,
          requestId,
          isNewConversation,
          toolCallResults,
          userMessage: userMessage,
          payload: payload,
          appConfig,
        });
        console.log('Response from chat', response);
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
