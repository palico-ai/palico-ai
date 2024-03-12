import * as path from 'path'
import * as fs from 'fs'

export const isDirectory = async (path: string): Promise<boolean> => {
  try {
    const stats = await fs.promises.lstat(path)
    return stats.isDirectory()
  } catch (error) {
    return false
  }
}

export const copyDirectory = async (src: string, dest: string): Promise<void> => {
  const entries = await fs.promises.readdir(src, { withFileTypes: true })
  await fs.promises.mkdir(dest, { recursive: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await fs.promises.copyFile(srcPath, destPath)
    }
  }
}