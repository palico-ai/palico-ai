import path from 'path';
import Project from '../project';
import OS from '../os';
import { backOff } from 'exponential-backoff';
import { Sequelize } from 'sequelize';
import { ENVName } from '../environment';
import { execSync } from 'child_process';

export interface ServiceBootstrapManagerConstructorParams {
  devMode: boolean;
}

interface BootstrapDefinitonFile {
  timestamp: number;
  packageVersion: string;
}

export interface RunBootstrapParams {
  startComposeServices: () => Promise<void>;
}

export class BootstrapModel {
  readonly devMode: boolean;

  constructor(params: ServiceBootstrapManagerConstructorParams) {
    this.devMode = params.devMode;
  }

  async bootstrapNeeded() {
    if (!this.devMode) {
      throw new Error('This method is only available in dev mode');
    }
    const bootstrapFile = await BootstrapModel.readBootstrapFile();
    if (!bootstrapFile) {
      return true;
    }
    const packageVersion = await BootstrapModel.getPalicoAppVersion();
    return bootstrapFile.packageVersion !== packageVersion;
  }

  async applyDBMigrations(dbURL: string) {
    // wait for the database to be ready
    await backOff(
      async () => {
        console.log('Attempting to connect to the database...');
        const db = new Sequelize(dbURL);
        await db.authenticate();
      },
      {
        delayFirstAttempt: true,
        startingDelay: 1000,
        numOfAttempts: 5,
        retry: (_, attemptNumber) => {
          console.log(`DB connection attempt ${attemptNumber} failed`);
          return true;
        },
      }
    );
    // run the migrations
    const nodeModulesDir = await Project.getPackageNodeModulesDir();
    const schemaPath = path.join(nodeModulesDir, 'prisma', 'schema.prisma');
    const command = `npx prisma migrate deploy --schema ${schemaPath}`;
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      [ENVName.PALICO_API_DATABASE_URL]: dbURL,
    };
    execSync(command, {
      stdio: 'inherit',
      env,
    });
  }

  async logBootstrapCompleted() {
    const filePath = await BootstrapModel.geBootstrapFilePath();
    const packageVersion = await BootstrapModel.getPalicoAppVersion();
    const content: BootstrapDefinitonFile = {
      timestamp: Date.now(),
      packageVersion,
    };
    await OS.createJsonFile(filePath, content);
  }

  private static async readBootstrapFile() {
    const tempPath = await Project.getPalicoTempDir();
    const filePath = path.join(tempPath, 'bootstrap.json');
    const fileContent = OS.doesFileExist(filePath);
    if (!fileContent) {
      return;
    }
    return OS.readJsonFile<BootstrapDefinitonFile>(filePath);
  }

  private static async getPalicoAppVersion() {
    const rootpath = await Project.getProjectRootDir();
    const packageJsonPath = path.join(rootpath, 'package.json');
    const packageJson = await OS.readJsonFile(packageJsonPath);
    const packageVersion = packageJson.dependencies['@palico-ai/app'];
    return packageVersion;
  }

  private static async geBootstrapFilePath() {
    const tempPath = await Project.getPalicoTempDir();
    return path.join(tempPath, 'bootstrap.json');
  }
}
