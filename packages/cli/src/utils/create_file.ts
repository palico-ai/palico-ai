import * as fs from 'fs';

export const createFile = async (path: string, content?: string) => {
  await fs.promises.writeFile(path, content ?? '', 'utf-8');
}
