import { execSync } from 'child_process';
import Project from './project';
import { JWTAuthenticator, commonConfig } from '@palico-ai/common';
import config from '../config';
import path from 'path';

interface ApplyDBMigraitonParams {
  DB_URL: string;
}

export const ApplyDBMigraiton = async (params?: ApplyDBMigraitonParams) => {
  const nodeModulesDir = await Project.getPackageNodeModulesDir();
  const schemaPath = path.join(nodeModulesDir, 'prisma', 'schema.prisma');
  const command = `npx prisma migrate deploy --schema ${schemaPath}`;
  execSync(command, {
    stdio: 'inherit',
    env: {
      ...(params?.DB_URL ? { [config.getDBEnvName()]: params?.DB_URL } : {}),
    },
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
