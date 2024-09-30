import { ConversationResponse, EvalTestCase } from '@palico-ai/common';
import ChainWorkflowExecutor, {
  RunWorkflowParams,
} from '../workflows/executor';
import AgentExecutor, { AgentExecutorChatParams } from '../agent/executor';
import TestSuiteModel from '../experiments/test_case.model';
import { ResponseMetadataKey } from '../types';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../tracing/internal.span';
import { LogQueue } from '../tracing/logger/log_queue';
import { Logger } from '../tracing/logger';
import { ConversationTelemetryModel } from '../services/database/conversation_telemetry';
import { PalicoSpanExporter } from '../tracing/exporter';

export interface ApplicationChatParams
  extends Omit<
    AgentExecutorChatParams,
    'conversationId' | 'requestId' | 'isNewConversation'
  > {
  conversationId?: string;
}

export class Application {
  static async chat(
    params: ApplicationChatParams
  ): Promise<ConversationResponse> {
    const conversationId = params.conversationId ?? uuid();
    const requestId = uuid();
    let output: ConversationResponse;
    return await startConversationSpan(
      conversationId,
      requestId,
      'Application.chat',
      async () => {
        try {
          const startTime = performance.now();
          const response = await AgentExecutor.chat({
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

  static async executeWorkflow(
    params: RunWorkflowParams
  ): Promise<ConversationResponse> {
    const result = await ChainWorkflowExecutor.execute(params);
    return result;
  }

  static async fetchTestDataset(name: string): Promise<EvalTestCase[]> {
    const dataset = await TestSuiteModel.findByName(name);
    return dataset;
  }
}
