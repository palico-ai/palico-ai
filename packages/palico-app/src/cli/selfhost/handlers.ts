import path from 'path';
import Project from '../../utils/project';
import OS from '../../utils/os';
import { BootstrapModel } from '../../utils/app_services/bootstrap';
import YAML from 'yaml';
import { ProjectService } from '../../utils/app_services/common';
import config from '../../config';

export const InitSelfHostCommandHandler = async () => {
  const selfhostRootDir = await Project.getSelfhostRootDir();
  const selfhostAssets = path.join(__dirname, 'docker');
  await OS.copyDirectory(selfhostAssets, selfhostRootDir);
};

interface ApplyDBMigrationsParams {
  user: string;
  password: string;
  db: string;
  host: string; // default to localhost
  port: number; // default to 5432
}

export const ApplyDBMigrationsCommandHandler = async (
  params: ApplyDBMigrationsParams
) => {
  console.log('Applying DB migrations...');
  console.log('Database', params);
  const { user, password, db, host, port } = params;
  // if (!user) {
  //   throw new Error('--user is required');
  // }
  // if (!password) {
  //   throw new Error('--password is required');
  // }
  const dbUrl = `postgres://${user}:${password}@${host}:${port}/${db}`;
  const bootstrap = new BootstrapModel({
    devMode: false,
  });

  await bootstrap.applyDBMigrations(dbUrl);
};

export const UpdateDockerComposeCommandHandler = async () => {
  const selfhostRootDir = await Project.getSelfhostRootDir();
  const composeFilePath = path.join(selfhostRootDir, 'docker-compose.yml');
  const composeContent = await OS.readFile(composeFilePath);
  const composeDef = YAML.parse(composeContent);
  const studioImage = composeDef.services[ProjectService.STUDIO].image;
  if (!studioImage) {
    throw new Error('Studio image is not defined');
  }
  const expectedVersion = config.getStudioDockerImage();
  if (studioImage !== expectedVersion) {
    console.log("Studio image doesn't match the expected version");
    console.log('Updating studio image to', expectedVersion);
    composeDef.services[ProjectService.STUDIO].image = expectedVersion;
    const updatedComposeContent = YAML.stringify(composeDef);
    await OS.createFile(composeFilePath, updatedComposeContent);
  }
  console.log('Docker compose file updated');
};
