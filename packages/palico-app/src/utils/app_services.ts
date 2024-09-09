import config from '../config';
import OS from './os';
import Project from './project';
import { RunMigration as RunMigrationOnDB, getServiceKey } from './scripts';
import YAML from 'json-to-pretty-yaml';
import { v2 as compose } from 'docker-compose';
import { exec } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import { ENVName } from './environment';

export enum ProjectService {
  POSTGRES_DB = 'postgres_db',
  JAEGER = 'jaeger',
  STUDIO = 'studio',
  API = 'api',
}

export interface StartDockerComposeParams {
  services: {
    [ProjectService.POSTGRES_DB]?: {
      enabled?: boolean; // default is true
      publicPort: number;
    };
    [ProjectService.STUDIO]?: {
      enabled?: boolean; // default is true
      publicPort: number;
    };
    [ProjectService.API]?: {
      publicPort: number;
    };
    [ProjectService.JAEGER]?: {
      enabled?: boolean; // default
    };
  };
}

export interface StartAPIServiceParams {
  dbPort: number;
  apiPort: number;
  onStart: () => Promise<void>;
  onExit: () => Promise<void>;
}

export class AppServiceManager {
  public static readonly CONFIG = {
    DATABASE: {
      user: 'root',
      password: 'root',
      database: 'palicoapp',
      internalPort: '5432',
    },
    STUDIO: {
      digest: config.getStudioDigest(),
      internalPort: '3000',
    },
  };

  static async createDockerComposeDef() {
    const serviceKey = await getServiceKey();
    const { composeFilePath } = await AppServiceManager.getDockerComposePath();
    const composeDef = {
      version: '3.8',
      services: {
        [ProjectService.POSTGRES_DB]: {
          image: 'postgres:15-alpine',
          restart: 'always',
          environment: [
            `POSTGRES_USER=${AppServiceManager.CONFIG.DATABASE.user}`,
            `POSTGRES_PASSWORD=${AppServiceManager.CONFIG.DATABASE.password}`,
            `POSTGRES_DB=${AppServiceManager.CONFIG.DATABASE.database}`,
          ],
          ports: [
            '${' +
              ENVName.PUBLIC_DATABASE_PORT +
              '}:' +
              this.CONFIG.DATABASE.internalPort,
          ],
          volumes: ['./postgres:/var/lib/postgresql/data'],
        },
        [ProjectService.JAEGER]: {
          image: 'jaegertracing/all-in-one:1.56',
          environment: [
            'SPAN_STORAGE_TYPE=badger',
            'BADGER_EPHEMERAL=false',
            'BADGER_DIRECTORY_VALUE=/badger/data',
            'BADGER_DIRECTORY_KEY=/badger/key',
          ],
          volumes: ['./badger:/badger'],
          ports: [
            '6831:6831',
            '6832:6832',
            '5778:5778',
            '16686:16686',
            '4317:4317',
            '4318:4318',
            '14250:14250',
            '14268:14268',
            '14269:14269',
            '9411:9411',
          ],
        },
        [ProjectService.STUDIO]: {
          image: `palicoai/studio:main@${AppServiceManager.CONFIG.STUDIO.digest}`,
          platform: 'linux/amd64',
          extra_hosts: ['host.docker.internal:host-gateway'],
          ports: [
            `${'${' + ENVName.PUBLIC_STUDIO_PORT + '}'}:${
              this.CONFIG.STUDIO.internalPort
            }`,
          ],
          environment: [
            'PALICO_AGENT_API_URL=http://host.docker.internal:${' +
              ENVName.PUBLIC_API_PORT +
              '}',
            `PALICO_SERVICE_KEY=${serviceKey}`,
          ],
        },
      },
    };
    const data = YAML.stringify(composeDef);
    await OS.createFile(composeFilePath, data);
  }

  static async buildDockerImages() {
    const { composeFilePath } = await AppServiceManager.getDockerComposePath();
    await compose.buildAll({
      cwd: path.dirname(composeFilePath),
      commandOptions: ['--no-cache'],
      log: true,
    });
  }

  static async startDockerCompose(params: StartDockerComposeParams) {
    const envVars: Record<string, string> = {};
    const serviceList: ProjectService[] = [];
    if (params.services[ProjectService.POSTGRES_DB]) {
      envVars[ENVName.PUBLIC_DATABASE_PORT] =
        params.services[ProjectService.POSTGRES_DB].publicPort.toString();
      serviceList.push(ProjectService.POSTGRES_DB);
    }
    if (params.services[ProjectService.STUDIO]) {
      envVars[ENVName.PUBLIC_STUDIO_PORT] =
        params.services[ProjectService.STUDIO].publicPort.toString();
      serviceList.push(ProjectService.STUDIO);
    }
    if (params.services[ProjectService.API]) {
      envVars[ENVName.PUBLIC_API_PORT] =
        params.services[ProjectService.API].publicPort.toString();
    }
    if (params.services[ProjectService.JAEGER]) {
      serviceList.push(ProjectService.JAEGER);
    }
    const { rootDir } = await this.getDockerComposePath();
    await this.setEnvirnmentVariables(envVars);
    await compose.upMany(serviceList, {
      cwd: rootDir,
      log: true,
    });
  }

  static async stopDockerCompose() {
    const { composeFilePath } = await AppServiceManager.getDockerComposePath();
    await compose.down({
      cwd: path.dirname(composeFilePath),
      log: true,
    });
  }

  static async applyDBMigrations() {
    console.log('Starting Database Service...');
    const { dbPort } = await AppServiceManager.findOpenPorts();
    await AppServiceManager.startDockerCompose({
      services: {
        [ProjectService.POSTGRES_DB]: {
          publicPort: dbPort,
        },
      },
    });
    // wait 8 seconds for the database to start
    await new Promise((resolve) => setTimeout(resolve, 8000));
    console.log('Running Migrations...');
    await RunMigrationOnDB({
      DB_URL: AppServiceManager.getDatabaseURL(dbPort.toString()),
    });
    console.log('Stopping Database Service...');
    await AppServiceManager.stopDockerCompose();
  }

  static async startApplication() {
    const ports = await AppServiceManager.findOpenPorts();
    await AppServiceManager.startDockerCompose({
      services: {
        [ProjectService.POSTGRES_DB]: {
          enabled: true,
          publicPort: ports.dbPort,
        },
        [ProjectService.STUDIO]: {
          enabled: true,
          publicPort: ports.studioPort,
        },
        [ProjectService.API]: {
          publicPort: ports.apiPort,
        },
        [ProjectService.JAEGER]: {
          enabled: true,
        },
      },
    });
    await AppServiceManager.startAPIService({
      dbPort: ports.dbPort,
      apiPort: ports.apiPort,
      onStart: async () => {
        await AppServiceManager.showResourceDetails();
      },
      onExit: async () => {
        await AppServiceManager.stopDockerCompose();
      },
    });
  }

  /**
   * Shows the resource details of the running services
   * Requires Docker Compose and API to be running
   */
  static async showResourceDetails() {
    const composePath = await AppServiceManager.getDockerComposePath();
    const dockerDBPort = await compose.port(
      ProjectService.POSTGRES_DB,
      this.CONFIG.DATABASE.internalPort,
      {
        cwd: composePath.rootDir,
      }
    );
    const studioPort = await compose.port(
      ProjectService.STUDIO,
      this.CONFIG.STUDIO.internalPort,
      {
        cwd: composePath.rootDir,
      }
    );
    const composeEnvVars = await this.getEnvirnmentVariables();
    const apiPort = composeEnvVars[ENVName.PUBLIC_API_PORT];
    console.log(
      chalk.green('Palico Studio:'),
      'http://localhost:' + studioPort.data.port
    );
    console.log(chalk.green('Tracing UI:'), 'http://localhost:16686');
    console.log(
      chalk.green('Database URL:'),
      AppServiceManager.getDatabaseURL(dockerDBPort.data.port.toString())
    );
    console.log(chalk.green('API URL:'), `http://localhost:${apiPort}`);
  }

  private static async startAPIService(params: StartAPIServiceParams) {
    const projectRoot = await Project.getWorkspaceRootDir();
    const envVars = {
      [ENVName.DATABASE_URL]: AppServiceManager.getDatabaseURL(
        params.dbPort.toString()
      ),
      ['TRACE_PREVIEW_URL_PREFIX']: 'http://localhost:16686/trace',
      [ENVName.PUBLIC_API_PORT]: params.apiPort.toString(),
    };
    console.log('Starting Server...');
    const command = `npx nodemon --exec ts-node src/main.ts`;
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

  private static async waitUntilServerExit() {
    process.on('SIGINT', async () => {
      console.log('Stopping Palico Application...');
      try {
        await AppServiceManager.stopDockerCompose();
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
    setInterval(() => {
      // keep the process running
    }, 1 << 30);
  }

  /**
   * Sets docker compose environment variables in .env file
   */
  private static async setEnvirnmentVariables(keyVals: Record<string, string>) {
    const { envFilePath } = await AppServiceManager.getDockerComposePath();
    let envContent = '';
    for (const key in keyVals) {
      envContent += `${key}=${keyVals[key]}\n`;
    }
    await OS.createFile(envFilePath, envContent);
  }

  private static async getEnvirnmentVariables() {
    const { envFilePath } = await AppServiceManager.getDockerComposePath();
    const content = await OS.readFile(envFilePath);
    const lines = content.split('\n');
    const envVars: Record<string, string> = {};
    for (const line of lines) {
      const [key, value] = line.split('=');
      envVars[key] = value;
    }
    return envVars;
  }

  private static async getDockerComposePath() {
    const rootDir = await Project.getPalicoTempDir();
    const composeFilePath = path.join(rootDir, 'docker-compose.yml');
    return {
      envFilePath: path.join(rootDir, '.env'),
      composeFilePath,
      rootDir,
    };
  }

  private static getDatabaseURL(port: string) {
    const { user, password, database } = AppServiceManager.CONFIG.DATABASE;
    return `postgresql://${user}:${password}@localhost:${port}/${database}`;
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
