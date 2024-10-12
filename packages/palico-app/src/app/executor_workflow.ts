import { QueueJobStatus, WorkflowResponse } from '@palico-ai/common';
import { ApplicationWorkflowParams } from './types';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../telemetry/internal.span';
import WorkflowExecutor from '../workflows/executor';
import { ResponseMetadataKey } from '../types';
import { Logger } from '../telemetry';
import { ConversationTraceModel } from '../telemetry/conversation_trace';
import { LogQueue } from '../telemetry/logger/log_queue';
import { WorkflowExecutionDataStore } from '../data_store/workflow_execution';

export const ExecuteApplicationWorkflow = async (
  params: ApplicationWorkflowParams
): Promise<WorkflowResponse> => {
  const conversationId = params.conversationId ?? uuid();
  const isNewConversation = !params.conversationId;
  const requestId = params.requestId ?? uuid();
  let output: WorkflowResponse;
  return await startConversationSpan(
    conversationId,
    requestId,
    'Application.executeWorkflow',
    async () => {
      try {
        const startTime = performance.now();
        const executor = new WorkflowExecutor(params.workflowName);
        const workflow = await executor.getWorkflow();
        await WorkflowExecutionDataStore.newRequestEntry({
          conversationId,
          requestId,
          workflowName: params.workflowName,
          status: QueueJobStatus.CREATED,
          graph: workflow.getSerializedGraph(),
          executionStack: [],
        });
        output = await executor.run({
          ...params,
          conversationId,
          requestId,
          isNewConversation,
        });
        const endTime = performance.now();
        await WorkflowExecutionDataStore.updateStatus(
          requestId,
          QueueJobStatus.SUCCESS
        );
        return {
          ...output,
          metadata: {
            ...output.metadata,
            [ResponseMetadataKey.ExecutionTime]: endTime - startTime,
          },
        };
      } catch (e) {
        if (e instanceof Error) {
          const stackTrace = e.stack;
          Logger.error('Application.executeWorkflow', e.message, stackTrace);
        }
        await WorkflowExecutionDataStore.updateStatus(
          requestId,
          QueueJobStatus.FAILED
        );
        throw e;
      } finally {
        await ConversationTraceModel.logRequest({
          workflowName: params.workflowName,
          conversationId,
          requestId,
          appConfig: params.appConfig,
          requestInput: params.input,
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
};
