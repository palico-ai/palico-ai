import path from 'path';
import Project from '../../utils/project';
import OS from '../../utils/os';
import { BootstrapModel } from '../../utils/app_services/bootstrap';
import YAML from 'yaml';
import { ProjectService } from '../../utils/app_services/common';
import config from '../../config';

export const InitSelfHostCommandHandler = async () => {
  const projectRootDir = await Project.getProjectRootDir();
  const selfhostAssets = path.join(__dirname, '..', '..', 'assets', 'selfhost');
  await OS.copyDirectory(selfhostAssets, projectRootDir);
  const dockerIgnorefile = `${projectRootDir}/.dockerignore`;
  await OS.createFile(dockerIgnorefile, '.palico/');
  await UpdatePalicoContainerImages();
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
  const dbUrl = `postgres://${user}:${password}@${host}:${port}/${db}`;
  const bootstrap = new BootstrapModel({
    devMode: false,
  });
  await bootstrap.applyDBMigrations(dbUrl);
};

export const UpdatePalicoContainerImages = async () => {
  const selfhostRootDir = await Project.getProjectRootDir();
  const composeFilePath = path.join(selfhostRootDir, 'docker-compose.yml');
  const composeExists = OS.doesFileExist(composeFilePath);
  if (!composeExists) {
    throw new Error('Docker compose file does not exist');
  }
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
