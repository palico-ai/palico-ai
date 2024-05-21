import { CreateExperimentParams, ExperimentMetadata, ExperimentTest, ExperimentTestCaseResult, ExperimentTestJSON } from '.';
import OS from '../utils/os';
import Project from '../utils/project';

export default class ExperimentModel {
  private static readonly DATE_SEPERATOR = '__';
  private static readonly TEST_DIR = 'tests';

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

  static async findByName(name: string): Promise<ExperimentMetadata> {
    const experiments = await this.getAllExperiments();
    const exp = experiments.find((e) => e.name === name);
    if (!exp) {
      throw new Error(`Experiment with name "${name}" not found`);
    }
    return exp;
  }

  static async updateTestJobStatus(
    path: string,
    job: Partial<ExperimentTestJSON['job']>
  ): Promise<void> {
    const content: ExperimentTestJSON = await OS.readJsonFile(path);
    await OS.createJsonFile(path, {
      ...content,
      job: {
        ...content.job,
        ...job,
      },
    });
  }

  static async setTestResult(path: string, result: ExperimentTestCaseResult[]): Promise<void> {
    const content: ExperimentTestJSON = await OS.readJsonFile(path);
    await OS.createJsonFile(path, {
      ...content,
      result,
    });
  }

  static async getAllTests(experimentName: string): Promise<ExperimentTest[]> {
    const exp = await ExperimentModel.findByName(experimentName);
    const testDir = await ExperimentModel.buildTestDirPath(exp.directoryName);
    const files = await OS.getFiles(testDir);
    const tests = await Promise.all(
      files.map(async (file) => {
        const content = await OS.readJsonFile(`${testDir}/${file}`);
        return {
          ...content,
          experimentName: exp.name,
          testName: file.replace(/\.json$/, ''),
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
    return `${rootPath}/${testName}.json`;
  }
}
