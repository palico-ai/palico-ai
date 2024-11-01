import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';
import { EvalCompositeKey } from '@palico-ai/common';
import { RunScript, RunScriptParams } from '../../app_scripts/run_script';

export const EvaluationRunnerWorkHandler: WorkHandler<
  EvalCompositeKey
> = async ({ id, data: testKey }) => {
  await ExperimentModel.updateTestJSON(testKey, {
    jobId: id,
  });
  await ExperimentExecutor.runEvaluation(testKey);
};

export const ScriptRunnerWorkHandler: WorkHandler<RunScriptParams> = async ({
  data: { requestId, scriptName, input },
}) => {
  await RunScript({
    requestId,
    scriptName,
    input,
  });
};
