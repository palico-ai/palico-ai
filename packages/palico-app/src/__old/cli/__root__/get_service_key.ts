import { getServiceKey } from '../../utils/jwt'
import * as chalk from 'chalk'

export const GetServiceKeyHandler = async (): Promise<void> => {
  const key = await getServiceKey()
  console.log(chalk.blue('Service Key') + `: ${key}`)
}
