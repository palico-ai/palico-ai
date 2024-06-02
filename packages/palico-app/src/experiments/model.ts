import { ExperimentJSON, TestNameWithExperiment } from '@palico-ai/common';
import {
  CreateExperimentParams,
  CreateExperimentTestParams,
  CreateTestConfigResult,
  ExperimentMetadata,
  ExperimentTest,
  ExperimentTestJSON,
  ExperimentTestMetadata,
  ExperimentTestStatus,
} from '.';
import OS from '../utils/os';
import Project from '../utils/project';
import omit from 'lodash/omit';

export default class ExperimentModel {
  private static readonly TEST_DIR = 'tests';
  private static readonly TEST_FILE_NAME = 'test.json';
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
      return OS.doesFileExist(`${expDir}/${dir}/${this.EXPERIMENT_FILE_NAME}`);
    });
    const experiments = await Promise.all(
      experimentNames.map(async (dir) => {
        const content = await OS.readJsonFile<ExperimentJSON>(
          `${expDir}/${dir}/${this.EXPERIMENT_FILE_NAME}`
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

  static async createTest(
    params: CreateExperimentTestParams
  ): Promise<CreateTestConfigResult> {
    const { testName, experimentName } = params;
    const exp = await ExperimentModel.findExperimentByName(experimentName);
    const testFilePath = await ExperimentModel.buildTestFilePath(
      experimentName,
      testName
    );
    if (OS.doesFileExist(testFilePath)) {
      throw new Error(`Test with name "${testName}" already exists`);
    }
    const createdAt = Date.now();
    const testJSON: ExperimentTestJSON = {
      ...params,
      status: {
        state: ExperimentTestStatus.CREATED,
      },
      createdAt,
      result: [],
    };
    await OS.createJsonFile(testFilePath, testJSON);
    return {
      filePath: testFilePath,
      test: {
        ...testJSON,
        testName,
        experimentName: exp.name,
      },
    };
  }

  static async updateTest(
    path: string,
    content: Partial<ExperimentTestJSON>
  ): Promise<ExperimentTestJSON> {
    const currentContent = await OS.readJsonFile(path);
    const updatedTest: ExperimentTestJSON = {
      ...currentContent,
      ...content,
    };
    await OS.createJsonFile(path, updatedTest);
    return updatedTest;
  }

  static async findExperimentByName(name: string): Promise<ExperimentMetadata> {
    const fileName = await ExperimentModel.buildExpertimentFilePath(name);
    if (!OS.doesFileExist(fileName)) {
      throw new Error(`Experiment with name "${name}" not found`);
    }
    const content = await OS.readJsonFile<ExperimentJSON>(fileName);
    return {
      name,
      ...content,
    };
  }

  static async getAllTests(): Promise<TestNameWithExperiment[]> {
    const allExperiments = await this.getAllExperiments();
    const tests = await Promise.all(
      allExperiments.map(async (exp) => {
        const testDir = await ExperimentModel.buildTestDirPath(exp.name);
        const possibleTestFiles = await OS.getFiles(testDir);
        return possibleTestFiles
          .filter((file) => file.endsWith(`.${ExperimentModel.TEST_FILE_NAME}`))
          .map((file) => ({
            experimentName: exp.name,
            testName: ExperimentModel.parseTestName(file),
          }));
      })
    );
    return tests.flat();
  }

  static async getTestsInExperiment(
    experimentName: string
  ): Promise<ExperimentTestMetadata[]> {
    const testDir = await ExperimentModel.buildTestDirPath(experimentName);
    const files = await OS.getFiles(testDir);
    const testFiles = files.filter((file) =>
      file.endsWith(`.${ExperimentModel.TEST_FILE_NAME}`)
    );
    const tests: ExperimentTestMetadata[] = await Promise.all(
      testFiles.map(async (file) => {
        const content = await OS.readJsonFile<ExperimentTestJSON>(
          `${testDir}/${file}`
        );
        return {
          ...omit(content, 'result'),
          experimentName,
          testName: ExperimentModel.parseTestName(file),
        };
      })
    );
    return tests;
  }

  static async readTestJSON(path: string): Promise<ExperimentTestJSON> {
    const content = await OS.readJsonFile(path);
    return content;
  }

  static async findTest(
    experimentName: string,
    testName: string
  ): Promise<ExperimentTest> {
    const testFilePath = await ExperimentModel.buildTestFilePath(
      experimentName,
      testName
    );
    const content = await ExperimentModel.readTestJSON(testFilePath);
    return {
      ...content,
      experimentName,
      testName,
    };
  }

  private static async buildExpDirPath(expDirName: string): Promise<string> {
    const expDir = await Project.getExperimentRootDir();
    return `${expDir}/${expDirName}`;
  }

  private static async buildExpertimentFilePath(
    expDirName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildExpDirPath(expDirName);
    return `${rootPath}/${this.EXPERIMENT_FILE_NAME}`;
  }

  private static async buildTestDirPath(expDirName: string): Promise<string> {
    const rootPath = await ExperimentModel.buildExpDirPath(expDirName);
    return `${rootPath}/${this.TEST_DIR}`;
  }

  static async buildTestFilePath(
    expName: string,
    testName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildTestDirPath(expName);
    return `${rootPath}/${testName}.${ExperimentModel.TEST_FILE_NAME}`;
  }

  private static parseTestName(testFileName: string): string {
    return testFileName.replace(`.${ExperimentModel.TEST_FILE_NAME}`, '');
  }
}
