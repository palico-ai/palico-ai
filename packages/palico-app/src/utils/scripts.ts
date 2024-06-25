import { execSync } from 'child_process';
import Project from './project';
import { JWTAuthenticator, commonConfig } from '@palico-ai/common';
import config from '../config';

interface ApplyDBMigraitonParams {
  DB_URL: string;
}

export const ApplyDBMigraiton = async (params?: ApplyDBMigraitonParams) => {
  const nodeModulesDir = await Project.getPackageNodeModulesDir();
  const schemaPath = `${nodeModulesDir}/prisma/schema.prisma`;
  let command = `npx prisma migrate deploy --schema ${schemaPath}`;
  if (params?.DB_URL) {
    command = `${config.getDBEnvName()}=${params.DB_URL} ${command}`;
  }
  execSync(command, {
    stdio: 'inherit',
  });
};

export const getServiceKey = async () => {
  const secret = commonConfig.getSecretKey();
  if (!secret) {
    throw new Error(
      'Secret key not found. Please set JWT_SECRET in your environment variables.'
    );
  }
  const token = await JWTAuthenticator.generateAPIJWT(
    { role: 'apikey' },
    secret
  );
  return token;
};
