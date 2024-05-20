import { Dataset } from '../evaluations';
import OS from '../utils/os';
import PalicoWorkspace from '../utils/workspace';

export default class DatasetModel {
  static readonly datasetFile = 'index.ts';

  static async getAllDatasets() {
    const datasetDirName = await PalicoWorkspace.getDatasetRootDir();
    const dirs = await OS.getDirectories(datasetDirName);
    const datasets = dirs.filter((dir) =>
      OS.doesFileExist(`${datasetDirName}/${dir}/${DatasetModel.datasetFile}`)
    );
    return datasets;
  }

  static async doesDatasetExist(name: string): Promise<boolean> {
    const filePath = await DatasetModel.datasetFilePath(name);
    return OS.doesFileExist(filePath);
  }

  static async getDatasetByName<Schema = unknown>(
    name: string
  ): Promise<Dataset<Schema>> {
    const filePath = await DatasetModel.datasetFilePath(name);
    const datasetExports = await import(filePath);
    const dataset = new datasetExports.default();
    return dataset;
  }

  private static async datasetFilePath(name: string) {
    const datasetDir = await PalicoWorkspace.getDatasetRootDir();
    return `${datasetDir}/${name}/${DatasetModel.datasetFile}`;
  }
}
