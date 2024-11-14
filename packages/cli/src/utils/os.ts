import * as path from 'path';
import * as fs from 'fs';

import { promisify } from 'util';
import { exec } from 'child_process';
export const isDirectory = async (path: string): Promise<boolean> => {
  try {
    const stats = await fs.promises.lstat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

export const copyDirectory = async (
  src: string,
  dest: string
): Promise<void> => {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  await fs.promises.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

export const getFileNames = async (path: string): Promise<string[]> => {
  const entries = await fs.promises.readdir(path, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
};

export const readFile = async (path: string): Promise<string> => {
  const content = await fs.promises.readFile(path, 'utf-8');
  return content;
};

export const setFileContent = async (
  path: string,
  content: string
): Promise<void> => {
  await fs.promises.writeFile(path, content);
};

export const createFile = async (path: string, content?: string) => {
  await fs.promises.writeFile(path, content ?? '', 'utf-8');
};

export const renameFile = async (
  folderPath: string,
  oldFileName: string,
  newFileName: string
) => {
  await fs.promises.rename(
    path.join(folderPath, oldFileName),
    path.join(folderPath, newFileName)
  );
};

export interface RunCommandOptions {
  cwd?: string;
}

export const runCommands = async (
  commands: string[],
  options: RunCommandOptions = {}
): Promise<void> => {
  console.log(`RUN ${options.cwd ? `in ${options.cwd}` : ''}: ${commands}`);
  const execAsync = promisify(exec);
  for (const command of commands) {
    const { stdout, stderr } = await execAsync(command, {
      cwd: options.cwd,
    });
    console.log(stdout);
    if (stderr) {
      console.error(`Error running command: ${command}`);
      throw new Error(stderr);
    }
  }
};
