import { EvalTestCase } from '@palico-ai/common';
import OS from '../../utils/os';
import Project from '../../utils/project';
import path from 'path';
import { TestDatasetFN } from './create_test';

export default class TestSuiteModel {
  static readonly fileName = 'index.ts';

  static async getAllTestSuites() {
    const datasetDirName = await Project.getTestSuiteRootDir();
    const dirs = await OS.getDirectories(datasetDirName);
    const datasets = dirs.filter((dir) =>
      OS.doesFileExist(path.join(datasetDirName, dir, TestSuiteModel.fileName))
    );
    return datasets;
  }

  static async doesTestSuiteExists(name: string): Promise<boolean> {
    const filePath = await TestSuiteModel.filePath(name);
    return OS.doesFileExist(filePath);
  }

  static async findByName(name: string): Promise<EvalTestCase[]> {
    const filePath = await TestSuiteModel.filePath(name);
    const datasetExports = await import(filePath);
    const builder = datasetExports.default as TestDatasetFN;
    const dataset = await builder();
    return dataset;
  }

  private static async filePath(name: string) {
    const datasetDir = await Project.getTestSuiteRootDir();
    return path.join(datasetDir, name, TestSuiteModel.fileName);
  }
}
