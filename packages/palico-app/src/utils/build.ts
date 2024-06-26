import config from '../config';
import OS from './os';
import Project from './project';
import { ApplyDBMigraiton, getServiceKey } from './scripts';
import YAML from 'json-to-pretty-yaml';
import { v2 as compose } from 'docker-compose';
import { exec, execSync } from 'child_process';
import chalk from 'chalk';

enum ProjectService {
  POSTGRES_DB = 'postgres_db',
  JAEGER = 'jaeger',
  STUDIO = 'studio',
}

export interface ProjectBuildStartDockerComposeParams {
  services?: ProjectService[];
}

export class ProjectBuild {
  private static readonly CONFIG = {
    DATABASE: {
      user: 'root',
      password: 'root',
      database: 'palicoapp',
    },
    STUDIO: {
      digest: config.getStudioDigest(),
    },
  };

  private static get databaseURL() {
    const { user, password, database } = ProjectBuild.CONFIG.DATABASE;
    return `postgresql://${user}:${password}@localhost:5432/${database}`;
  }

  static async createDockerCompose() {
    const serviceKey = await getServiceKey();
    const apiPort = config.getAPIPort();
    const { composeFilePath } = await ProjectBuild.getDockerComposePath();
    const composeDef = {
      version: '3.8',
      services: {
        [ProjectService.POSTGRES_DB]: {
          image: 'postgres:15-alpine',
          restart: 'always',
          environment: [
            `POSTGRES_USER=${ProjectBuild.CONFIG.DATABASE.user}`,
            `POSTGRES_PASSWORD=${ProjectBuild.CONFIG.DATABASE.password}`,
            `POSTGRES_DB=${ProjectBuild.CONFIG.DATABASE.database}`,
          ],
          ports: ['5432:5432'],
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
          image: `palicoai/studio:main@${ProjectBuild.CONFIG.STUDIO.digest}`,
          platform: 'linux/amd64',
          extra_hosts: ['host.docker.internal:host-gateway'],
          ports: ['5173:3000'],
          environment: [
            `PALICO_AGENT_API_URL=http://host.docker.internal:${apiPort}`,
            `PALICO_SERVICE_KEY=${serviceKey}`,
          ],
        },
      },
    };
    const data = YAML.stringify(composeDef);
    await OS.createFile(composeFilePath, data);
  }

  static async startDockerCompose(
    params?: ProjectBuildStartDockerComposeParams
  ) {
    const { services } = params || {};
    const tempDir = await Project.getPalicoTempDir();
    if (services) {
      await compose.upMany(services, {
        cwd: tempDir,
        log: true,
      });
      return;
    }
    await compose.upAll({
      cwd: tempDir,
      log: true,
    });
  }

  static async stopDockerCompose() {
    const { composeFilePath } = await ProjectBuild.getDockerComposePath();
    execSync(`docker-compose -f ${composeFilePath} down`, {
      stdio: 'inherit',
    });
  }

  static async applyDBMigrations() {
    console.log('Starting Database Service...');
    await ProjectBuild.startDockerCompose({
      services: [ProjectService.POSTGRES_DB],
    });
    // wait 5 seconds for the database to start
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Applying Migrations...');
    await ApplyDBMigraiton({ DB_URL: ProjectBuild.databaseURL });
    console.log('Stopping Database Service...');
    await ProjectBuild.stopDockerCompose();
  }

  static showResourceDetails() {
    console.log(chalk.green('Database URL:'), ProjectBuild.databaseURL);
    console.log(chalk.green('Jaeger URL:'), 'http://localhost:16686');
    console.log(chalk.green('Studio URL:'), 'http://localhost:5173');
    console.log(
      chalk.green('API URL:'),
      `http://localhost:${config.getAPIPort()}`
    );
  }

  static async startLocalServer() {
    const envName = config.getDBEnvName();
    const projectRoot = await Project.getWorkspaceRootDir();
    const envVars = {
      [envName]: ProjectBuild.databaseURL,
      ['TRACE_PREVIEW_URL_PREFIX']: 'http://localhost:16686/trace',
    };
    console.log('Starting Server...');
    const command = `nodemon --exec ts-node src/main.ts`;
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
    ProjectBuild.showResourceDetails();
    console.log("Server started. Press 'Ctrl + C' to stop the server.");
    await ProjectBuild.waitUntilServerExit();
  }

  private static async waitUntilServerExit() {
    process.on('SIGINT', async () => {
      console.log('Stopping Palico Application...');
      try {
        await ProjectBuild.stopDockerCompose();
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

  private static async getDockerComposePath() {
    const rootDir = await Project.getPalicoTempDir();
    const composeFilePath = `${rootDir}/docker-compose.yml`;
    return {
      composeFilePath,
      rootDir,
    };
  }
}
