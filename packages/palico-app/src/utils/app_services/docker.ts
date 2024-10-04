import path from 'path';
import YAML from 'yaml';
import { v2 as compose } from 'docker-compose';
import { ENVName } from '../environment';
import Project from '../project';
import { ProjectService } from './common';
import config from '../../config/index';
import OS from '../os';

export interface DockerComposeConstructorParams {
  devMode: boolean;
}

export interface ServiceInfo {
  [ProjectService.POSTGRES_DB]: {
    databaseURL: string;
  };
  [ProjectService.STUDIO]: {
    publicURL: string;
  };
  [ProjectService.API]?: {
    publicURL: string;
  };
}

interface StartDevServicesParams {
  envVars: {
    [ENVName.DOCKER_COMPOSE_DB_USERNAME]: string;
    [ENVName.DOCKER_COMPOSE_STUDIO_PORT]: string;
    [ENVName.PALICO_STUDIO_API_URL]: string;
    [ENVName.PALICO_STUDIO_API_SERVICE_KEY]: string;
  };
}

interface ComposeFilePathResponse {
  composeFilePath: string;
  envFilePath: string;
  rootDir: string;
}

/**
 * Manages the docker-compose services for the project
 */
export class DockerCompose {
  private static readonly config = {
    database: {
      user: 'root',
      password: 'root',
      database: 'palicoapp',
    },
    containerInternalPort: {
      [ProjectService.POSTGRES_DB]: '5432',
      [ProjectService.STUDIO]: '3000',
      [ProjectService.API]: '8000',
    },
  };

  readonly devMode: boolean;
  private _savedFilePaths?: ComposeFilePathResponse;

  constructor(params: DockerComposeConstructorParams) {
    this.devMode = params.devMode;
  }

  async createComposeFile() {
    const dbService = {
      [ProjectService.POSTGRES_DB]: {
        image: 'postgres:15-alpine',
        restart: 'always',
        environment: [
          `POSTGRES_USER=${DockerCompose.config.database.user}`,
          `POSTGRES_PASSWORD=${DockerCompose.config.database.password}`,
          `POSTGRES_DB=${DockerCompose.config.database.database}`,
        ],
        ports: [
          `${DockerCompose.escapedEnvVar(ENVName.DOCKER_COMPOSE_DB_USERNAME)}:${
            DockerCompose.config.containerInternalPort[
              ProjectService.POSTGRES_DB
            ]
          }`,
        ],
        ...(this.devMode
          ? { volumes: ['./data:/var/lib/postgresql/data'] }
          : {}),
      },
    };

    const studio = {
      [ProjectService.STUDIO]: {
        image: config.getStudioDockerImage(),
        platform: 'linux/amd64',
        restart: 'always',
        ports: [
          '${' +
            ENVName.DOCKER_COMPOSE_STUDIO_PORT +
            '}:' +
            DockerCompose.config.containerInternalPort[ProjectService.STUDIO],
        ],
        ...(this.devMode
          ? { extra_hosts: ['host.docker.internal:host-gateway'] }
          : {}),
        environment: [
          'PALICO_AGENT_API_URL=${' + ENVName.PALICO_STUDIO_API_URL + '}',
          'PALICO_SERVICE_KEY=${' + ENVName.PALICO_STUDIO_API_SERVICE_KEY + '}',
          ...(this.devMode ? ['DEV_MODE=true'] : []),
        ],
      },
    };

    // TODO: Add API service if not in dev mode
    const composeDef = {
      version: '3.8',
      services: {
        ...dbService,
        ...studio,
      },
    };
    const data = YAML.stringify(composeDef);
    const { composeFilePath } = await this.getFilePath();
    await OS.createFile(composeFilePath, data);
  }

  async buildImages() {
    const { composeFilePath } = await this.getFilePath();
    await compose.buildAll({
      cwd: path.dirname(composeFilePath),
      commandOptions: ['--no-cache'],
      log: true,
    });
  }

  // starts the docker-compose services
  // expects all environment variables to be set
  async startDevServices(params: StartDevServicesParams) {
    if (!this.devMode) {
      throw new Error('This method is only available in dev mode');
    }
    const { rootDir, envFilePath } = await this.getFilePath();
    await OS.createEnvFile(envFilePath, params.envVars);
    await compose.upAll({
      cwd: rootDir,
      log: true,
    });
  }

  async stopServices() {
    const { rootDir } = await this.getFilePath();
    await compose.down({
      cwd: rootDir,
      log: true,
    });
  }

  async getServicePort(serviceName: ProjectService) {
    if (this.devMode && serviceName === ProjectService.API) {
      throw new Error('API service is not available in dev mode');
    }
    const { rootDir } = await this.getFilePath();
    const publicPort = await compose.port(
      serviceName,
      DockerCompose.config.containerInternalPort[serviceName],
      {
        cwd: rootDir,
      }
    );
    if (publicPort.data.port === undefined) {
      throw new Error('Port not found');
    }
    return publicPort.data.port;
  }

  async getServiceInfo(): Promise<ServiceInfo> {
    const dbPort = await this.getServicePort(ProjectService.POSTGRES_DB);
    const studioPort = await this.getServicePort(ProjectService.STUDIO);
    return {
      [ProjectService.POSTGRES_DB]: {
        databaseURL: `postgres://${DockerCompose.config.database.user}:${DockerCompose.config.database.password}@localhost:${dbPort}/${DockerCompose.config.database.database}`,
      },
      [ProjectService.STUDIO]: {
        publicURL: `http://localhost:${studioPort}`,
      },
    };
  }

  // reads the value of an environment variable from the .env file
  async readEnvVar(varname: ENVName) {
    if (!this.devMode) {
      throw new Error('This method is only available in dev mode');
    }
    const { envFilePath } = await this.getFilePath();
    const content = await OS.readEnvFile(envFilePath);
    return content[varname];
  }

  public static internalHostUrl(port: number) {
    return `http://host.docker.internal:${port}`;
  }

  private async getFilePath(): Promise<ComposeFilePathResponse> {
    if (!this._savedFilePaths) {
      if (this.devMode) {
        const tempDir = await Project.getPalicoTempDir();
        const rootDir = path.join(tempDir, 'dev');
        const composeFilePath = path.join(rootDir, 'docker-compose.yml');
        this._savedFilePaths = {
          envFilePath: path.join(rootDir, '.env'),
          composeFilePath,
          rootDir: rootDir,
        };
      } else {
        const projectRoot = await Project.getProjectRootDir();
        const composeFilePath = path.join(projectRoot, 'docker-compose.yml');
        this._savedFilePaths = {
          envFilePath: path.join(projectRoot, '.env'),
          composeFilePath,
          rootDir: projectRoot,
        };
      }
    }
    return this._savedFilePaths;
  }

  private static escapedEnvVar(varname: ENVName) {
    return '${' + varname + '}';
  }
}
