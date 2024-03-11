import * as chalk from 'chalk'
import { SQLStorage } from '../../../storage/sql'
import { sequelize } from '../../../storage/sql/database'
import { CurrentProject } from '../../../utils/current_project'
import { CreateApplicationAPIServer } from '../../../api'
import { getServiceKey } from '../../../utils/jwt'

// Builds the application, syncs database, and starts an API server
export const StartDevServer = async (): Promise<void> => {
  await CurrentProject.buildApplication()
  const storage = new SQLStorage()
  const FORCE_SYNC = process.env["FORCE_SYNC_DB"] === 'true'
  await sequelize.sync({ force: FORCE_SYNC })
  const api = await CreateApplicationAPIServer({ storage })
  const serviceKey = await getServiceKey()
  const PORT = process.env["PORT"] ?? 8000
  api.listen(PORT, () => {
    console.log(chalk.green('Server is running on port ' + PORT))
    console.log(chalk.blue('Service key') + `: ${serviceKey}`)
  })
}

void StartDevServer()
