import chalk from 'chalk';
import { getServiceKey } from '../utils/scripts';

export const GenerateJWTToken = async (): Promise<void> => {
  const token = await getServiceKey();
  console.log(chalk.blue('Token') + `: ${token}`);
};
