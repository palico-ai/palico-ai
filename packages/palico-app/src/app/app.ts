import {
  ConversationResponse,
  EvalTestCase,
  WorkflowResponse,
} from '@palico-ai/common';
import AgentExecutor, { AgentExecutorChatParams } from '../agent/executor';
import TestSuiteModel from '../experiments/test_case.model';
import { ResponseMetadataKey } from '../types';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../telemetry/internal.span';
import { LogQueue } from '../telemetry/logger/log_queue';
import { Logger } from '../telemetry/logger';
import { ConversationTraceModel } from '../telemetry/conversation_trace';
import { ApplicationWorkflowParams } from './types';
import { ExecuteApplicationWorkflow } from './executor_workflow';
import JobQueue from '../services/job_queue';

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
          await ConversationTraceModel.logRequest({
            conversationId,
            requestId,
            appConfig: params.appConfig,
            agentName: params.agentName,
            requestInput: params.content,
            responseOutput: output ?? {
              conversationId,
              requestId,
              message: 'An error occurred',
            },
          });
          console.log('Flushing logs and spans');
          await LogQueue.tryFlushingLogs(requestId);
        }
      }
    );
  }

  static async executeWorkflow(
    params: ApplicationWorkflowParams
  ): Promise<WorkflowResponse> {
    const response = await ExecuteApplicationWorkflow(params);
    return response;
  }

  static async queueWorkflowJob(params: ApplicationWorkflowParams) {
    const response = await JobQueue.runWorkflow(params);
    return response;
  }

  static async fetchTestDataset(name: string): Promise<EvalTestCase[]> {
    const dataset = await TestSuiteModel.findByName(name);
    return dataset;
  }
}
