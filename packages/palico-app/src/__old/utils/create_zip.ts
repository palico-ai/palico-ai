import * as archiver from 'archiver'
import { createWriteStream } from 'fs'
import * as path from 'path'
import { mkdir } from 'fs/promises'
import { type IncludeStatement } from '../app/types.js'

const CreateDirectoryIfNotExists = async (directoryPath: string): Promise<void> => {
  await mkdir(directoryPath, { recursive: true })
}

export async function ZipDirectory (
  rootPath: string,
  zipFilePath: string,
  includePaths: IncludeStatement
): Promise<void> {
  const directory = path.dirname(zipFilePath)
  await CreateDirectoryIfNotExists(directory)

  // eslint-disable-next-line no-async-promise-executor
  await new Promise<void>(async (resolve, reject) => {
    const outputStream = createWriteStream(zipFilePath)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })

    archive.pipe(outputStream)

    outputStream.on('close', () => {
      console.log('Write Stream closed')
      console.log(`${archive.pointer()} total bytes`)
      resolve()
    })

    outputStream.on('error', (err: Error) => {
      console.log('Write Stream error')
      console.log(`${archive.pointer()} total bytes`)
      reject(err)
    })

    archive.on('error', (err: Error) => {
      reject(err)
    })

    archive.on('close', () => {
      console.log('Archive closed')
      console.log(`${archive.pointer()} total bytes`)
    })

    archive.on('finish', () => {
      console.log('Archive finished')
      console.log(`${archive.pointer()} total bytes`)
    })

    const { files, directories } = includePaths
    files.forEach((filePath) => {
      const file = path.join(rootPath, filePath)
      archive.file(file, { name: filePath })
    })

    directories.forEach((directoryPath) => {
      const directory = path.join(rootPath, directoryPath)
      console.log(`Archiving directory ${directory}`)
      archive.directory(directory + '/', directoryPath)
    })

    await archive.finalize()
    console.log('Archive finalized')
    // resolve()
  })
}
