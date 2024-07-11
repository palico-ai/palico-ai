import {
  CreateQuickLabParams,
  QuickLabContentJSON,
  QuickLabMetadata,
  QuickLab,
  UpdateStudioLabParams,
} from '@palico-ai/common';
import Project from '../utils/project';
import OS from '../utils/os';
import path from 'path';

export default class QuickLabModel {
  private static readonly LAB_METADATA_FILE_NAME = 'lab.json';
  private static readonly LAB_CONTENT_FILE_NAME = 'lab.content.json';

  static async create(params: CreateQuickLabParams): Promise<QuickLab> {
    const { name, experiments, testCases, experimentTestResults } = params;
    const metadataFilePath = await QuickLabModel.buildLabMetadataPath(name);
    const contentFilePath = await QuickLabModel.buildLabContentPath(name);
    if (
      OS.doesFileExist(metadataFilePath) ||
      OS.doesFileExist(contentFilePath)
    ) {
      throw new Error(`Lab with name "${name}" already exists`);
    }
    const createdAt = Date.now();
    const labJSON: QuickLabMetadata = {
      id: name,
      name,
      createdAt,
    };
    const contentJSON: QuickLabContentJSON = {
      experiments,
      testCases,
      experimentTestResults,
    };
    await Promise.all([
      OS.createJsonFile(metadataFilePath, labJSON),
      OS.createJsonFile(contentFilePath, contentJSON),
    ]);
    return {
      ...labJSON,
      ...contentJSON,
    };
  }

  static async getByName(name: string): Promise<QuickLab | null> {
    const metadataFilePath = await QuickLabModel.buildLabMetadataPath(name);
    const contentFilePath = await QuickLabModel.buildLabContentPath(name);
    if (
      !OS.doesFileExist(metadataFilePath) ||
      !OS.doesFileExist(contentFilePath)
    ) {
      return null;
    }
    const [metadata, content] = await Promise.all([
      OS.readJsonFile<QuickLabMetadata>(metadataFilePath),
      OS.readJsonFile<QuickLabContentJSON>(contentFilePath),
    ]);
    return {
      ...metadata,
      ...content,
    };
  }

  static async findAll(): Promise<QuickLabMetadata[]> {
    const rootDir = await Project.getQuickLabRootDir();
    const dirs = await OS.getDirectories(rootDir);
    return Promise.all(
      dirs.map(async (dir) => {
        const metadataFilePath = path.join(
          rootDir,
          dir,
          QuickLabModel.LAB_METADATA_FILE_NAME
        );
        const metadata = await OS.readJsonFile<QuickLabMetadata>(
          metadataFilePath
        );
        return {
          id: metadata.id,
          name: metadata.name,
          createdAt: metadata.createdAt,
        };
      })
    );
  }

  static async update(name: string, params: UpdateStudioLabParams) {
    const content = await QuickLabModel.getByName(name);
    if (!content) {
      throw new Error(`Lab with id "${name}" not found`);
    }
    const updatedValues: QuickLabContentJSON = {
      ...content,
      ...params,
    };
    const contentFilePath = await QuickLabModel.buildLabContentPath(name);
    await OS.createJsonFile(contentFilePath, updatedValues);
  }

  static async remove(name: string) {
    const rootDir = await Project.getQuickLabRootDir();
    const labDir = path.join(rootDir, name);
    await OS.removeDirectory(labDir);
  }

  private static async buildLabMetadataPath(name: string): Promise<string> {
    const rootDir = await Project.getQuickLabRootDir();
    return path.join(rootDir, name, QuickLabModel.LAB_METADATA_FILE_NAME);
  }

  private static async buildLabContentPath(name: string): Promise<string> {
    const rootDir = await Project.getQuickLabRootDir();
    return path.join(rootDir, name, QuickLabModel.LAB_CONTENT_FILE_NAME);
  }
}
