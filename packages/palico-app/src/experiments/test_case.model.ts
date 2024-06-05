import { ExperimentTestCaseDataset } from '.';
import OS from '../utils/os';
import Project from '../utils/project';

export default class TestCaseDatasetModel {
  static readonly fileName = 'index.ts';

  static async getAllDatasets() {
    const datasetDirName = await Project.getTestCaseDatasetRootDir();
    const dirs = await OS.getDirectories(datasetDirName);
    const datasets = dirs.filter((dir) =>
      OS.doesFileExist(`${datasetDirName}/${dir}/${TestCaseDatasetModel.fileName}`)
    );
    return datasets;
  }

  static async doesDatasetExists(name: string): Promise<boolean> {
    const filePath = await TestCaseDatasetModel.datasetFilePath(name);
    return OS.doesFileExist(filePath);
  }

  static async findByName(
    name: string
  ): Promise<ExperimentTestCaseDataset[]> {
    const filePath = await TestCaseDatasetModel.datasetFilePath(name);
    const datasetExports = await import(filePath);
    return datasetExports.default
  }

  private static async datasetFilePath(name: string) {
    const datasetDir = await Project.getTestCaseDatasetRootDir();
    return `${datasetDir}/${name}/${TestCaseDatasetModel.fileName}`;
  }
}
