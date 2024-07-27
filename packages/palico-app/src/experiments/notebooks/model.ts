import {
  NotebookCompositeKey,
  NotebookJSON,
  NotebookMetadata,
  UpdateNotebookJSONParams,
} from '@palico-ai/common';
import ExperimentModel from '../model';
import path from 'path';
import OS from '../../utils/os';

export default class NotebookModel {
  private static readonly NOTEBOOK_DIR = 'notebooks';

  static async createNewNotebook(params: NotebookJSON) {
    const { experimentName, notebookName } = params;
    const notebookFilePath = await NotebookModel.buildNotebookFilePath(
      experimentName,
      notebookName
    );
    if (OS.doesFileExist(notebookFilePath)) {
      throw new Error(`Notebook with name "${notebookName}" already exists`);
    }
    await OS.createJsonFile(notebookFilePath, params);
    return params;
  }

  static async getNotebooksForExperiment(
    experimentName: string
  ): Promise<NotebookMetadata[]> {
    const experimentDir = await ExperimentModel.buildExpDirPath(experimentName);
    const notebooksDir = path.join(experimentDir, NotebookModel.NOTEBOOK_DIR);
    const notebookFiles = await OS.getFiles(notebooksDir);
    return notebookFiles.map((file) => {
      return {
        experimentName,
        notebookName: file.replace('.json', ''),
      };
    });
  }

  static async getNotebook(key: NotebookCompositeKey) {
    const notebookFilePath = await NotebookModel.buildNotebookFilePath(
      key.experimentName,
      key.notebookName
    );
    return OS.readJsonFile<NotebookJSON>(notebookFilePath);
  }

  static async updateNotebook(
    key: NotebookCompositeKey,
    params: UpdateNotebookJSONParams
  ) {
    const notebookFilePath = await NotebookModel.buildNotebookFilePath(
      key.experimentName,
      key.notebookName
    );
    const notebook = await OS.readJsonFile<NotebookJSON>(notebookFilePath);
    const updatedNotebook = {
      ...notebook,
      ...params,
    };
    await OS.createJsonFile(notebookFilePath, updatedNotebook);
    return updatedNotebook;
  }

  static async removeNotebook(key: NotebookCompositeKey) {
    const notebookFilePath = await NotebookModel.buildNotebookFilePath(
      key.experimentName,
      key.notebookName
    );
    await OS.removeFile(notebookFilePath);
  }

  private static async buildNotebookFilePath(
    experimentName: string,
    notebookName: string
  ) {
    const experimentDir = await ExperimentModel.buildExpDirPath(experimentName);
    return path.join(
      experimentDir,
      NotebookModel.NOTEBOOK_DIR,
      `${notebookName}.json`
    );
  }
}
