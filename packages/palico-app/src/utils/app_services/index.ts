import OS from '../os';
import Project from '../project';
import { getServiceKey } from '../scripts';
import { exec } from 'child_process';
import chalk from 'chalk';
import { ENVName } from '../environment';
import { DockerCompose, ServiceInfo } from './docker';
import { BootstrapModel } from './bootstrap';
import { ProjectService } from './common';
import config from '../../config';

export interface StartAPIServiceParams {
  devMode: boolean;
  databaseURL: string;
  apiPort: number;
  onStart: () => Promise<void>;
  onExit: () => Promise<void>;
}

export interface StartDevAppParams {
  cleanStart?: boolean;
}

export class AppServiceManager {
  static async startDevApp(
    params: StartDevAppParams = {
      cleanStart: false,
    }
  ) {
    const bootstrap = new BootstrapModel({
      devMode: true,
    });
    const bootstrapNeeded = await bootstrap.bootstrapNeeded();
    const shouldBootstrap = params.cleanStart ?? bootstrapNeeded;
    const ports = await AppServiceManager.findOpenPorts();
    const serviceKey = await getServiceKey();
    const compose = new DockerCompose({
      devMode: true,
    });
    if (shouldBootstrap) {
      console.log('Project bootstrapping required');
      console.log('Creating project service definitions...');
      await compose.createComposeFile();
      await compose.buildImages();
    }
    console.log('Starting required services...');
    await compose.startDevServices({
      envVars: {
        [ENVName.DOCKER_COMPOSE_DB_USERNAME]: ports.dbPort.toString(),
        [ENVName.DOCKER_COMPOSE_STUDIO_PORT]: ports.studioPort.toString(),
        [ENVName.PALICO_STUDIO_API_URL]: DockerCompose.internalHostUrl(
          ports.apiPort
        ),
        [ENVName.PALICO_STUDIO_API_SERVICE_KEY]: serviceKey,
      },
    });
    const serviceInfo = await compose.getServiceInfo();
    if (shouldBootstrap) {
      console.log('Applying database migrations...');
      await bootstrap.applyDBMigrations(
        serviceInfo[ProjectService.POSTGRES_DB].databaseURL
      );
      console.log('Bootstrapping completed');
      await bootstrap.logBootstrapCompleted();
    }
    console.log('Starting API Service...');
    await AppServiceManager.startAPIService({
      devMode: true,
      databaseURL: serviceInfo[ProjectService.POSTGRES_DB].databaseURL,
      apiPort: ports.apiPort,
      onStart: async () => {
        await AppServiceManager.printResourceDetails({
          ...serviceInfo,
          [ProjectService.API]: {
            publicURL: 'http://localhost:' + ports.apiPort,
          },
        });
      },
      onExit: async () => {
        await compose.stopServices();
      },
    });
  }

  static async startProductionApp() {
    const dbUrl = config.getDBUrl();
    if (!dbUrl) {
      throw new Error('Database URL is not defined');
    }
    const bootstrap = new BootstrapModel({
      devMode: false,
    });
    await bootstrap.applyDBMigrations(dbUrl);
    await AppServiceManager.startAPIService({
      devMode: false,
      databaseURL: dbUrl,
      apiPort: config.getAPIPort(),
      onStart: async () => {
        console.log('API Service Started');
      },
      onExit: async () => {
        console.log('API Service Stopped');
      },
    });
  }

  /**
   * Shows the resource details of the running services
   * Requires Docker Compose and API to be running
   */
  static async printResourceDetails(serviceInfo: Required<ServiceInfo>) {
    const {
      [ProjectService.POSTGRES_DB]: db,
      [ProjectService.STUDIO]: studio,
      [ProjectService.API]: api,
    } = serviceInfo;
    console.log(chalk.green('Palico Studio:'), chalk.blue(studio.publicURL));
    console.log(chalk.green('Database URL:'), chalk.blue(db.databaseURL));
    console.log(chalk.green('API URL:'), chalk.blue(api.publicURL));
  }

  private static async startAPIService(params: StartAPIServiceParams) {
    const projectRoot = await Project.getProjectRootDir();
    const envVars = {
      [ENVName.PALICO_API_DATABASE_URL]: params.databaseURL,
      [ENVName.PALICO_API_PORT]: params.apiPort.toString(),
    };
    console.log('Starting Server...');
    const command = params.devMode
      ? 'npx nodemon --exec ts-node src/main.ts'
      : 'npx ts-node src/main.ts';
    const serverPs = exec(command, {
      cwd: projectRoot,
      env: {
        ...process.env,
        ...envVars,
      },
    });
    serverPs.stdout?.pipe(process.stdout);
    serverPs.stderr?.pipe(process.stderr);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await params.onStart();
    console.log(`Server Started. Press Ctrl+C to stop the server`);
    process.on('SIGINT', async () => {
      console.log('Stopping Server...');
      try {
        await params.onExit();
        serverPs.kill('SIGINT');
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
  }

  private static async findOpenPorts() {
    const dbPort = await OS.getLocallyOpenPort({
      port: 5432,
      maxPort: 6000,
    });
    const studioPort = await OS.getLocallyOpenPort({
      port: 3000,
      maxPort: 4000,
    });
    const apiPort = await OS.getLocallyOpenPort({
      port: 8000,
      maxPort: 9000,
    });
    return {
      dbPort,
      studioPort,
      apiPort,
    };
  }
}
