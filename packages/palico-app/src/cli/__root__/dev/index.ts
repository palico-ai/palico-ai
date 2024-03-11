import * as nodemon from 'nodemon'
import { CurrentProject } from '../../../utils'
import * as path from 'path'

interface ServeDevServerOptions {
  port?: number
  forceSync?: boolean
}

export const ServeDevServer = async (options: ServeDevServerOptions): Promise<void> => {
  const port = options.port ?? process.env["PORT"] ?? 8000
  const forceSync = options.forceSync
  const projectPath = await CurrentProject.getPackageDirectory()
  // Expect this to run after compiled with typescript
  nodemon({
    script: path.join(__dirname, 'server.js'),
    ext: 'ts',
    watch: [projectPath],
    env: {
      PORT: port.toString(),
      FORCE_SYNC_DB: forceSync ? 'true' : 'false'
    }
  })
}
