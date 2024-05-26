import { existsSync } from 'fs';
import { mkdir, readFile, readdir, writeFile } from 'fs/promises';

export default class OS {
  static async createDirectory(path: string) {
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
    const dir = path.substring(0, path.lastIndexOf('/'));
    const dirExists = await this.doesDirectoryExist(dir);
    if (!dirExists) {
      await this.createDirectory(dir);
    }
    await writeFile(path, content, 'utf-8');
  }

  static async createJsonFile(path: string, content: unknown) {
    // check if directory exists
    const dir = path.substring(0, path.lastIndexOf('/'));
    const dirExists = await this.doesDirectoryExist(dir);
    if (!dirExists) {
      await this.createDirectory(dir);
    }
    await writeFile(path, JSON.stringify(content, null, 2), 'utf-8');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async readJsonFile<T=any>(path: string) : Promise<T> {
    // Read a JSON file and parse its content
    const content = await readFile(path, 'utf-8');
    return JSON.parse(content);
  }

  static async getDirectories(path: string) : Promise<string[]> {
    try{
    const dirs = await readdir(path, { withFileTypes: true });
    return dirs.filter(d => d.isDirectory()).map(d => d.name);
    }catch(error) {
      if(OS.isDirDoesntExistError(error)) {
        return [];
      }
      throw error;
    }
  }

  static async getFiles(path: string) : Promise<string[]> {
    try{
    const files = await readdir(path, { withFileTypes: true });
    return files.filter(f => f.isFile()).map(f => f.name);
    } catch(error) {
      if(OS.isDirDoesntExistError(error)) {
        return [];
      }
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static isDirDoesntExistError(error: any) {
    return error?.code === 'ENOENT';
  }
}
