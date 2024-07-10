import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';
import { EvalCompositeKey } from '@palico-ai/common';

export const ExperimentTestRunner: WorkHandler<EvalCompositeKey> = async ({
  id,
  data: testKey,
}) => {
  await ExperimentModel.updateTestJSON(testKey, {
    jobId: id,
  });
  await ExperimentExecutor.runEvaluation(testKey);
};
