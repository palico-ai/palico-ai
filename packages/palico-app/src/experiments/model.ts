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
  private static readonly DATE_SEPERATOR = '__';
  private static readonly TEST_DIR = 'tests';
  private static readonly TEST_FILE_NAME = 'test.json';

  static async createNewExperiment(
    params: CreateExperimentParams
  ): Promise<ExperimentMetadata> {
    const { name } = params;
    if (name.indexOf(ExperimentModel.DATE_SEPERATOR) !== -1) {
      throw new Error('Experiment name cannot contain character "__"');
    }
    const existingExperiments = await ExperimentModel.getAllExperiments();
    if (existingExperiments.find((e) => e.name === name)) {
      throw new Error(`Experiment with name "${name}" already exists`);
    }
    const expDir = await Project.getExperimentRootDir();
    const dirname = Date.now() + ExperimentModel.DATE_SEPERATOR + name;
    const newExpDir = `${expDir}/${dirname}`;
    await OS.createDirectory(newExpDir);
    return this.parseExperimentName(dirname);
  }

  static async getAllExperiments(): Promise<ExperimentMetadata[]> {
    const expDir = await Project.getExperimentRootDir();
    const dirs = await OS.getDirectories(expDir);
    return dirs.map(this.parseExperimentName);
  }

  static async createTest(
    params: CreateExperimentTestParams
  ): Promise<CreateTestConfigResult> {
    const { testName, experimentName } = params;
    const exp = await ExperimentModel.findByName(experimentName);
    const testFilePath = await ExperimentModel.buildTestFilePath(
      exp.directoryName,
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

  static async findByName(name: string): Promise<ExperimentMetadata> {
    const experiments = await this.getAllExperiments();
    const exp = experiments.find((e) => e.name === name);
    if (!exp) {
      throw new Error(`Experiment with name "${name}" not found`);
    }
    return exp;
  }

  static async getAllTests(
    experimentName: string
  ): Promise<ExperimentTestMetadata[]> {
    const exp = await ExperimentModel.findByName(experimentName);
    const testDir = await ExperimentModel.buildTestDirPath(exp.directoryName);
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
          experimentName: exp.name,
          testName: file.replace(`.${ExperimentModel.TEST_FILE_NAME}`, ''),
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
    const exp = await ExperimentModel.findByName(experimentName);
    const testFilePath = await ExperimentModel.buildTestFilePath(
      exp.directoryName,
      testName
    );
    const content = await ExperimentModel.readTestJSON(testFilePath);
    return {
      ...content,
      experimentName: exp.name,
      testName,
    };
  }

  private static parseExperimentName(dirname: string): ExperimentMetadata {
    const [date, name] = dirname.split(ExperimentModel.DATE_SEPERATOR);
    return {
      directoryName: dirname,
      createdAt: new Date(parseInt(date, 10)).toISOString(),
      name,
    };
  }

  private static async buildExpDirPath(expDirName: string): Promise<string> {
    const expDir = await Project.getExperimentRootDir();
    return `${expDir}/${expDirName}`;
  }

  private static async buildTestDirPath(expDirName: string): Promise<string> {
    const rootPath = await ExperimentModel.buildExpDirPath(expDirName);
    return `${rootPath}/${this.TEST_DIR}`;
  }

  static async buildTestFilePath(
    expDirName: string,
    testName: string
  ): Promise<string> {
    const rootPath = await ExperimentModel.buildTestDirPath(expDirName);
    return `${rootPath}/${testName}.${ExperimentModel.TEST_FILE_NAME}`;
  }
}
