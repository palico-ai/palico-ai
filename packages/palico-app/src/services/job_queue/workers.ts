import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';
import { EvalCompositeKey } from '@palico-ai/common';
import { ApplicationWorkflowParams } from '../../app/types';
import { ExecuteApplicationWorkflow } from '../../app/executor_workflow';

export const ExperimentTestQueueWorkHandler: WorkHandler<
  EvalCompositeKey
> = async ({ id, data: testKey }) => {
  await ExperimentModel.updateTestJSON(testKey, {
    jobId: id,
  });
  await ExperimentExecutor.runEvaluation(testKey);
};

export const WorkflowRunnerQueueWorkHandler: WorkHandler<
  Omit<ApplicationWorkflowParams, 'requestId'> & { requestId: string }
> = async ({ data: params }) => {
  await ExecuteApplicationWorkflow({
    ...params,
  });
};
