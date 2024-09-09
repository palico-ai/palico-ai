import { execSync } from 'child_process';
import Project from './project';
import { JWTAuthenticator, commonConfig } from '@palico-ai/common';
import path from 'path';
import { ENVName } from './environment';

interface ApplyDBMigraitonParams {
  DB_URL: string;
}

export const RunMigration = async (params?: ApplyDBMigraitonParams) => {
  const nodeModulesDir = await Project.getPackageNodeModulesDir();
  const schemaPath = path.join(nodeModulesDir, 'prisma', 'schema.prisma');
  const command = `npx prisma migrate deploy --schema ${schemaPath}`;
  const env: NodeJS.ProcessEnv = {
    ...process.env,
  };
  if (params?.DB_URL) {
    env[ENVName.DATABASE_URL] = params.DB_URL;
  }
  execSync(command, {
    stdio: 'inherit',
    env,
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
