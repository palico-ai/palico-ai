import {
  ExperimentJSON,
  EvalCompositeKey,
  EvalResultJSON,
  CreateEvaluationParams,
  CreateExperimentParams,
  ExperimentMetadata,
  Evaluation,
  EvalJSON,
  JobQueueStatus,
  EvaluationMetadata,
} from '@palico-ai/common';
import { CreateEvalJobConfigResult } from '.';
import OS from '../utils/os';
import Project from '../utils/project';
import omit from 'lodash/omit';
import path from 'path';

export default class ExperimentModel {
  private static readonly TEST_DIR = 'evals';
  private static readonly EVAL_FILE_NAME = 'eval.json';
  private static readonly EVAL_RESULT_FILE_NAME = 'result.json';
  private static readonly EXPERIMENT_FILE_NAME = 'experiment.json';

  static async createNewExperiment(
    params: CreateExperimentParams
  ): Promise<ExperimentMetadata> {
    const { name } = params;
    const expFilePath = await ExperimentModel.buildExpertimentFilePath(name);
    if (OS.doesFileExist(expFilePath)) {
      throw new Error(`Experiment with name "${name}" already exists`);
    }
    const createdAt = Date.now();
    const expJSON: ExperimentJSON = {
      ...params,
      createdAt,
      tags: [],
    };
    await OS.createJsonFile(expFilePath, expJSON);
    return {
      name,
      ...expJSON,
    };
  }

  static async removeExperiment(name: string): Promise<void> {
    const expDir = await ExperimentModel.buildExpDirPath(name);
    await OS.removeDirectory(expDir);
  }

  static async getAllExperiments(): Promise<ExperimentMetadata[]> {
    const expDir = await Project.getExperimentRootDir();
    const dirs = await OS.getDirectories(expDir);
    const experimentNames = dirs.filter((dir) => {
      return OS.doesFileExist(
        path.join(expDir, dir, this.EXPERIMENT_FILE_NAME)
      );
    });
    const experiments = await Promise.all(
      experimentNames.map(async (dir) => {
        const content = await OS.readJsonFile<ExperimentJSON>(
          path.join(expDir, dir, this.EXPERIMENT_FILE_NAME)
        );
        return {
          ...content,
          directoryName: dir,
          name: dir,
        };
      })
    );
    return experiments.sort((a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1;
    });
  }

  static async createEvalJobConfig(
    params: CreateEvaluationParams
  ): Promise<CreateEvalJobConfigResult> {
    const { evalName: testName, experimentName } = params;
    const exp = await ExperimentModel.findExperimentByName(experimentName);
    const testFilePath = await ExperimentModel.buildTestFilePath(
      experimentName,
      testName
    );
    if (OS.doesFileExist(testFilePath)) {
      throw new Error(`Test with name "${testName}" already exists`);
    }
    const createdAt = Date.now();
    const testJSON: EvalJSON = {
      ...params,
      status: {
        state: JobQueueStatus.CREATED,
      },
      createdAt,
    };
    await OS.createJsonFile(testFilePath, testJSON);
    const resultFilePath = await ExperimentModel.buildEvalResultFilePath(
      experimentName,
      testName
    );
    const resultJSON: EvalResultJSON = {
      result: [],
    };
    const testRootDir = await ExperimentModel.buildTestDirPath(experimentName);
    await OS.createJsonFile(resultFilePath, resultJSON);
    return {
      testRootDir,
      eval: {
        ...testJSON,
        evalName: testName,
        experimentName: exp.name,
      },
    };
  }

  static async updateTestJSON(
    key: EvalCompositeKey,
    content: Partial<EvalJSON>
  ): Promise<EvalJSON> {
    const { experimentName, evalName: testName } = key;
    const path = await ExperimentModel.buildTestFilePath(
      experimentName,
      testName
    );
    const currentContent = await OS.readJsonFile<EvalJSON>(path);
    const updatedTest: EvalJSON = {
      ...currentContent,
      ...content,
    };
    await OS.createJsonFile(path, updatedTest);
    return updatedTest;
  }

  static async updateTestResultJSON(
    key: EvalCompositeKey,
    content: EvalResultJSON
  ): Promise<EvalResultJSON> {
    const { experimentName, evalName: testName } = key;
    const path = await ExperimentModel.buildEvalResultFilePath(
      experimentName,
      testName
    );
    const currentContent = await OS.readJsonFile<EvalResultJSON>(path);
    const updatedTest: EvalResultJSON = {
      ...currentContent,
      ...content,
    };
    await OS.createJsonFile(path, updatedTest);
    return updatedTest;
  }

  static async findExperimentByName(name: string): Promise<ExperimentMetadata> {
    const fileName = await ExperimentModel.buildExpertimentFilePath(name);
    if (!OS.doesFileExist(fileName)) {
      throw new Error(
        `Experiment with name "${name}" notio9u aà2fgv6 b  found`
      );
    }
    const content = await OS.readJsonFile<ExperimentJSON>(fileName);
    return {
      name,
      ...content,
    };
  }

  static async getAllTests(): Promise<EvalCompositeKey[]> {
    const allExperiments = await this.getAllExperiments();
    const tests = await Promise.all(
      allExperiments.map(async (exp) => {
        const testDir = await ExperimentModel.buildTestDirPath(exp.name);
        const possibleTestFiles = await OS.getFiles(testDir);
        return possibleTestFiles
          .filter((file) => file.endsWith(`.${ExperimentModel.EVAL_FILE_NAME}`))
          .map((file) => ({
            experimentName: exp.name,
            evalName: ExperimentModel.parseEvalName(file),
          }));
      })
    );
    return tests.flat();
  }

  static async getEvalsInExperiment(
    experimentName: string
  ): Promise<EvaluationMetadata[]> {
    const testDir = await ExperimentModel.buildTestDirPath(experimentName);
    const files = await OS.getFiles(testDir);
    const testFiles = files.filter((file) =>
      file.endsWith(`.${ExperimentModel.EVAL_FILE_NAME}`)
    );
    const tests: EvaluationMetadata[] = await Promise.all(
      testFiles.map(async (file) => {
        const content = await OS.readJsonFile<EvalJSON>(
          path.join(testDir, file)
        );
        return {
          ...omit(content, 'result'),
          experimentName,
          evalName: ExperimentModel.parseEvalName(file),
        };
      })
    );
    return tests;
  }

  static async findEval(
    experimentName: string,
    evalName: string
  ): Promise<Evaluation> {
    const testFilePath = await ExperimentModel.buildTestFilePath(
      experimentName,
      evalName
    );
    const resultFilePath = await ExperimentModel.buildEvalResultFilePath(
      experimentName,
      evalName
    );
    const [content, result] = await Promise.all([
      OS.readJsonFile<EvalJSON>(testFilePath),
      OS.readJsonFile<EvalResultJSON>(resultFilePath),
    ]);
    return {
      ...content,
      ...result,
      experimentName,
      evalName: evalName,
    };
  }

  static async buildExpDirPath(expDirName: string): Promise<string> {
    const expDir = await Project.getExperimentRootDir();
    return path.join(expDir, expDirName);
  }

  private static async buildExpertimentFilePath(
    expDirName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildExpDirPath(expDirName);
    return path.join(rootPath, this.EXPERIMENT_FILE_NAME);
  }

  private static async buildTestDirPath(expDirName: string): Promise<string> {
    const rootPath = await ExperimentModel.buildExpDirPath(expDirName);
    return path.join(rootPath, this.TEST_DIR);
  }

  static async buildTestFilePath(
    expName: string,
    testName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildTestDirPath(expName);
    return `${rootPath}/${testName}.${ExperimentModel.EVAL_FILE_NAME}`;
  }

  static async buildEvalResultFilePath(
    expName: string,
    testName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildTestDirPath(expName);
    return path.join(
      rootPath,
      `${testName}.${ExperimentModel.EVAL_RESULT_FILE_NAME}`
    );
  }

  private static parseEvalName(filename: string): string {
    return filename.replace(`.${ExperimentModel.EVAL_FILE_NAME}`, '');
  }
}
