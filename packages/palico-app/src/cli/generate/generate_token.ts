import chalk from 'chalk';
import { getServiceKey } from '../../utils/scripts';

export interface GenerateServiceKeyParams {
  secret?: string;
}

export const GenerateJWTToken = async (
  params: GenerateServiceKeyParams
): Promise<void> => {
  let token;
  if (params.secret) {
    token = await getServiceKey({
      secret: params.secret,
    });
  } else {
    token = await getServiceKey();
  }
  console.log(chalk.blue('Token') + `: ${token}`);
};
