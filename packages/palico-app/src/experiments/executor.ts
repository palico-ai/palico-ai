import DatasetModel from "../models/datasets";
import JobQueue from "../services/job_queue";
import OS from "../utils/os";
import ExperimentModel from "./model";
import { CreateNewExperimentTestResult, ExperimentTest, ExperimentTestJSON } from "./types";

export type CreateExperimentTestParams = Omit<
  ExperimentTest,
  'createdAt' | 'filePath' | 'job' | 'result'
>;

export class ExperimentExecutor {
  static async startNewTestRun(
    params: CreateExperimentTestParams
  ): Promise<CreateNewExperimentTestResult> {
    const { testName, experimentName } = params;
    const exp = await ExperimentModel.findByName(experimentName);
    const testFilePath = await ExperimentModel.buildTestFilePath(
      exp.directoryName,
      testName
    );
    if(OS.doesFileExist(testFilePath)) {
      throw new Error(`Test with name "${testName}" already exists`);
    }
    const datasetExists = await DatasetModel.doesDatasetExist(params.testCaseDatasetName);
    if(!datasetExists) {
      throw new Error(`Dataset with name "${params.testCaseDatasetName}" does not exist`);
    }
    const createdAt = Date.now();
    const testJSON: ExperimentTestJSON = {
      ...params,
      job: {
        status: 'created',
      },
      createdAt,
      result: [],
    };
    await OS.createJsonFile(testFilePath, testJSON);
    // TODO: Move run experiment to here
    const jobId = await JobQueue.runExperiment({ filePath: testFilePath });
    return {
      jobId,
    };
  }
}