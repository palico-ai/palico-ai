import { JobQueueStatus, JSONAbleObject } from '@palico-ai/common';
import { startConversationSpan } from '../tracing/internal.span';
import AppScriptRequestDataStore from '../data_store/app_script_request';
import AppScriptExecutor from './executor';
import { logger } from '../tracing';
import { LogQueue } from '../tracing/logger/log_queue';
import { uuid } from '../utils/common';
import JobQueue from '../services/job_queue';

export interface QueueScriptParams {
  scriptName: string;
  input: JSONAbleObject;
}

export interface RunScriptParams {
  requestId: string;
  scriptName: string;
  input: JSONAbleObject;
}

export const QueueScript = async (params: QueueScriptParams) => {
  const requestId = uuid();
  const request = await AppScriptRequestDataStore.logAppScriptRequest({
    requestId,
    scriptName: params.scriptName,
    input: params.input,
    status: JobQueueStatus.CREATED,
  });
  await JobQueue.runScript({
    requestId,
    scriptName: params.scriptName,
    input: params.input,
  });
  return request;
};

export const RunScript = async (params: RunScriptParams) => {
  return await startConversationSpan(
    params.requestId,
    params.requestId,
    'Run Script',
    async () => {
      try {
        await AppScriptRequestDataStore.updateStatus(
          params.requestId,
          JobQueueStatus.ACTIVE
        );
        await AppScriptExecutor.run({
          scriptName: params.scriptName,
          requestId: params.requestId,
          input: params.input,
        });
        await AppScriptRequestDataStore.updateStatus(
          params.requestId,
          JobQueueStatus.SUCCESS
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred';
        logger.error('RunScript', errorMessage);
        await AppScriptRequestDataStore.updateStatus(
          params.requestId,
          JobQueueStatus.FAILED
        );
        throw error;
      } finally {
        await LogQueue.tryFlushingLogs(params.requestId);
      }
    }
  );
};
