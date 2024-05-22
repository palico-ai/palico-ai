import { WorkHandler } from 'pg-boss';
import ExperimentModel from '../../experiments/model';
import { ExperimentExecutor } from '../../experiments/executor';

export interface ExperimentTestRunnerData {
  filePath: string;
}

export const ExperimentTestRunner: WorkHandler<
  ExperimentTestRunnerData
> = async (input) => {
  await ExperimentModel.updateTest(input.data.filePath, {
    jobId: input.id,
  });
  await ExperimentExecutor.runTest(input.data.filePath);
};
