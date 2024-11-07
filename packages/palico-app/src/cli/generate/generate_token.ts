import chalk from 'chalk';
import { getServiceKey } from '../../utils/scripts';
import { uuid } from '../../utils/common';

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

export const GenerateSecretKey = async () => {
  const secret = uuid();
  const token = await getServiceKey({
    secret,
  });
  console.log(chalk.blue('Secret') + `: ${secret}`);
  console.log(chalk.blue('Token') + `: ${token}`);
};
