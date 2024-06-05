import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';
import { ExperimentTestKeyID } from '@palico-ai/common';

export const ExperimentTestRunner: WorkHandler<
  ExperimentTestKeyID
> = async ({
  id,
  data: testKey,
}) => {
  await ExperimentModel.updateTestJSON(testKey, {
    jobId: id,
  });
  await ExperimentExecutor.runTest(testKey);
};
