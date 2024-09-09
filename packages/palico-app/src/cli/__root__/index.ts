import OS from '../../utils/os';
import { AppServiceManager } from '../../utils/app_services';
import Project from '../../utils/project';
import path from 'path';
import chalk from 'chalk';
import { wait } from '@palico-ai/common';

interface BootstrapJSON {
  updatedAt: string;
}

const getBootstrapFilePath = async () => {
  const tempDir = await Project.getPalicoTempDir();
  return path.join(tempDir, 'bootstrap.json');
};

const markBootstrapCompleted = async () => {
  const filePath = await getBootstrapFilePath();
  const content: BootstrapJSON = {
    updatedAt: new Date().toISOString(),
  };
  await OS.createJsonFile(filePath, content);
};

const projectNeedsBootstrap = async () => {
  const filePath = await getBootstrapFilePath();
  return !OS.doesFileExist(filePath);
};

export const BootstrapProject = async () => {
  console.log("Stopping project's containers...");
  try {
    await AppServiceManager.stopDockerCompose();
  } catch (e) {
    console.log('No containers to stop');
  }
  await wait(2000);
  console.log('Creating Containers...');
  await AppServiceManager.createDockerComposeDef();
  console.log("Building project's containers...");
  await AppServiceManager.buildDockerImages();
  console.group('Applying migrations...');
  await AppServiceManager.applyDBMigrations();
  console.groupEnd();
  await markBootstrapCompleted();
};

export const StartPalicoApp = async () => {
  const needsBootstrap = await projectNeedsBootstrap();
  if (needsBootstrap) {
    throw new Error(
      chalk.red(
        'Project needs to be bootstrapped. Run the following command to bootstrap your project: \n'
      ) + chalk.greenBright('npm run palico bootstrap')
    );
  }
  await AppServiceManager.startApplication();
};

export const ShowStatus = async () => {
  await AppServiceManager.showResourceDetails();
};
