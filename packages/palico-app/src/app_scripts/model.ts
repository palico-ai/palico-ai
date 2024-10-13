import path from 'path';
import OS from '../utils/os';
import Project from '../utils/project';
import { AppScript } from '.';

export default class AppScriptModel {
  private static readonly scriptFile = 'index.ts';

  static async getAll() {
    const scriptDirName = await Project.getAppScriptRootDir();
    const dirs = await OS.getDirectories(scriptDirName);
    const scripts = dirs.filter((dir) =>
      OS.doesFileExist(path.join(scriptDirName, dir, AppScriptModel.scriptFile))
    );
    return scripts;
  }

  static async doesExists(name: string): Promise<boolean> {
    const filePath = await AppScriptModel.getFilePath(name);
    return OS.doesFileExist(filePath);
  }

  static async getByName(name: string): Promise<AppScript> {
    const filePath = await AppScriptModel.getFilePath(name);
    const appScript = await import(filePath);
    return new appScript.default();
  }

  private static async getFilePath(name: string) {
    const workflowDir = await Project.getAppScriptRootDir();
    return path.join(workflowDir, name, AppScriptModel.scriptFile);
  }
}
