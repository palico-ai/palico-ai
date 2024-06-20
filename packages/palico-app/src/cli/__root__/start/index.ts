import Project from '../../../utils/project';
import YAML from 'json-to-pretty-yaml';
import OS from '../../../utils/os';
import { ApplyDBMigraiton, getServiceKey } from '../../../utils/scripts';
import { v2 as compose } from 'docker-compose';
import { exec } from 'child_process';
import config from '../../../config';

const CONFIG = {
  DATABASE: {
    user: 'root',
    password: 'root',
    database: 'palicoapp',
  },
  STUDIO: {
    digest: config.getStudioDigest(),
  },
};

const getDatabaseURL = async () => {
  const { user, password, database } = CONFIG.DATABASE;
  return `postgresql://${user}:${password}@localhost:5432/${database}`;
};

const getDockerComposePath = async () => {
  const rootDir = await Project.getPalicoTempDir();
  const composeFilePath = `${rootDir}/docker-compose.yml`;
  return {
    composeFilePath,
    rootDir,
  };
};

interface CreateDockerComposeParams {
  disableStudio?: boolean;
}

const createDockerCompose = async (
  params: CreateDockerComposeParams = {
    disableStudio: false,
  }
) => {
  const secretKey = await getServiceKey();
  const apiPort = config.getAPIPort();
  const { composeFilePath } = await getDockerComposePath();
  const studioFragment = {
    image: `palicoai/studio:release-studio@${CONFIG.STUDIO.digest}`,
    platform: 'linux/amd64',
    extra_hosts: ['host.docker.internal:host-gateway'],
    ports: ['5173:3000'],
    environment: [
      `PALICO_AGENT_API_URL=http://host.docker.internal:${apiPort}`,
      `PALICO_SERVICE_KEY=${secretKey}`,
    ],
  };
  const composeDef = {
    version: '3.8',
    services: {
      postgres_db: {
        image: 'postgres:15-alpine',
        restart: 'always',
        environment: [
          `POSTGRES_USER=${CONFIG.DATABASE.user}`,
          `POSTGRES_PASSWORD=${CONFIG.DATABASE.password}`,
          `POSTGRES_DB=${CONFIG.DATABASE.database}`,
        ],
        ports: ['5432:5432'],
        volumes: ['./postgres:/var/lib/postgresql/data'],
      },
      jaeger: {
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
      ...(params.disableStudio ? {} : { studio: studioFragment }),
    },
  };
  const data = YAML.stringify(composeDef);
  await OS.createFile(composeFilePath, data);
};

const startDockerCompose = async () => {
  const tempDir = await Project.getPalicoTempDir();
  await compose.upAll({
    cwd: tempDir,
    log: true,
  });
};

const startServer = async () => {
  const dbURL = await getDatabaseURL();
  const envName = config.getDBEnvName();
  const projectRoot = await Project.getWorkspaceRootDir();
  const envVars = {
    [envName]: dbURL,
    ['TRACE_PREVIEW_URL_PREFIX']: 'http://localhost:16686/trace',
  };
  const command = `nodemon --exec ts-node src/main.ts`;
  const serverPs = exec(command, {
    cwd: projectRoot,
    env: {
      ...process.env,
      ...envVars,
    },
  });
  serverPs.stdout?.pipe(process.stdout);
};

const waitUntilExit = async () => {
  const { composeFilePath } = await getDockerComposePath();
  process.on('SIGINT', () => {
    console.log('Stopping Palico Application...');
    exec(`docker-compose -f ${composeFilePath} down`, (error, out) => {
      if (error) {
        console.error(error);
        process.exit(1);
      } else {
        console.log(out);
        process.exit(0);
      }
    });
  });
  setInterval(() => {
    // keep the process running
  }, 1 << 30);
};

const applyDBMigraiton = async () => {
  const dbURL = await getDatabaseURL();
  await ApplyDBMigraiton({ DB_URL: dbURL });
};

interface StartPalicoAppOptions {
  studio: boolean;
}

export const StartPalicoApp = async (options: StartPalicoAppOptions) => {
  console.log('Creating Containers...');
  await createDockerCompose({
    disableStudio: !options.studio,
  });
  console.log('Starting Containers...');
  await startDockerCompose();
  console.log('Applying DB Migrations...');
  await applyDBMigraiton();
  console.log('Starting Server...');
  await startServer();
  await waitUntilExit();
};
