import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';
import { EvalJobKeyID } from '@palico-ai/common';

export const ExperimentTestRunner: WorkHandler<EvalJobKeyID> = async ({
  id,
  data: testKey,
}) => {
  await ExperimentModel.updateTestJSON(testKey, {
    jobId: id,
  });
  await ExperimentExecutor.runEvaluation(testKey);
};
