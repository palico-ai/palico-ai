import { exec } from 'child_process'
import { promisify } from 'util'

export const RunShellCommands = async (commands: string[]): Promise<void> => {
  const execAsync = promisify(exec)
  for (const command of commands) {
    const { stdout, stderr } = await execAsync(command)
    console.log(stdout)
    if (stderr) {
      throw new Error(stderr)
    }
  }
}
