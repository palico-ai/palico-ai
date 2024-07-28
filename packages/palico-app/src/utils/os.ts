import { existsSync } from 'fs';
import { mkdir, readFile, readdir, rmdir, writeFile, rm } from 'fs/promises';
import { dirname } from 'path';
import Project from './project';

export default class OS {
  static async createDirectory(path: string) {
    await Project.validatePathWithinProject(path);
    await mkdir(path, { recursive: true });
  }

  static async doesDirectoryExist(path: string) {
    try {
      await readdir(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  static doesFileExist(path: string) {
    try {
      return existsSync(path);
    } catch (error) {
      return false;
    }
  }

  static async createFile(path: string, content: string) {
    // check if directory exists
    await Project.validatePathWithinProject(path);
    const dir = dirname(path);
    const dirExists = await this.doesDirectoryExist(dir);
    if (!dirExists) {
      await this.createDirectory(dir);
    }
    await writeFile(path, content, 'utf-8');
  }

  static async createJsonFile(path: string, content: unknown) {
    // check if directory exists
    await Project.validatePathWithinProject(path);
    const dir = dirname(path);
    const dirExists = await this.doesDirectoryExist(dir);
    if (!dirExists) {
      await this.createDirectory(dir);
    }
    await writeFile(path, JSON.stringify(content, null, 2), {
      encoding: 'utf-8',
      flag: 'w',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async readJsonFile<T = any>(path: string): Promise<T> {
    // Read a JSON file and parse its content
    await Project.validatePathWithinProject(path);
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  static async getDirectories(path: string): Promise<string[]> {
    try {
      await Project.validatePathWithinProject(path);
      const dirs = await readdir(path, { withFileTypes: true });
      return dirs.filter((d) => d.isDirectory()).map((d) => d.name);
    } catch (error) {
      if (OS.isDirDoesntExistError(error)) {
        return [];
      }
      throw error;
    }
  }

  static async getFiles(path: string): Promise<string[]> {
    try {
      await Project.validatePathWithinProject(path);
      const files = await readdir(path, { withFileTypes: true });
      return files.filter((f) => f.isFile()).map((f) => f.name);
    } catch (error) {
      if (OS.isDirDoesntExistError(error)) {
        return [];
      }
      throw error;
    }
  }

  static async removeDirectory(path: string) {
    await Project.validatePathWithinProject(path);
    await rmdir(path, { recursive: true });
  }

  static async removeFile(path: string) {
    await Project.validatePathWithinProject(path);
    await rm(path);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static isDirDoesntExistError(error: any) {
    return error?.code === 'ENOENT';
  }
}
