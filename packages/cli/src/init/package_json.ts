import { readFile, runCommands, setFileContent } from '../utils/os';

export type PackageJSONSchema = {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  nodemonConfig: {
    ignore: string[];
  };
};

export interface InitPackageJSON {
  directory: string;
  projectName: string;
  version?: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  createDirectoryIfNotExists?: boolean;
}

export interface InstallDependencyParams {
  name: string;
  version?: string;
}

export default class PackageJSON {
  private packageDirectory: string;

  constructor(packageDirectory: string) {
    this.packageDirectory = packageDirectory;
  }

  async installDependencies(
    dependencies: InstallDependencyParams[],
    isDev = false
  ) {
    const dependencyList = dependencies
      .map((dep) => `${dep.name}@${dep.version ?? 'latest'}`)
      .join(' ');
    const installCommand = isDev ? 'npm install -D' : 'npm install';
    const command = `cd ${this.packageDirectory} && ${installCommand} ${dependencyList}`;
    await runCommands([command]);
  }

  async addScript(name: string, script: string) {
    const command = `cd ${this.packageDirectory} && npm set-script ${name} "${script}"`;
    await runCommands([command]);
  }

  async getCurrentPackageJSON() {
    const packageJSON = await readFile(`${this.packageDirectory}/package.json`);
    return JSON.parse(packageJSON);
  }

  async updatePackageJSON(packageJSON: Partial<PackageJSONSchema>) {
    const currentPackageJSON = await this.getCurrentPackageJSON();
    const newPackageJSON = { ...currentPackageJSON, ...packageJSON };
    await setFileContent(
      `${this.packageDirectory}/package.json`,
      JSON.stringify(newPackageJSON, null, 2)
    );
  }

  async install() {
    const command = `cd ${this.packageDirectory} && npm install`;
    await runCommands([command]);
  }

  static async init(params: InitPackageJSON): Promise<PackageJSON> {
    const { directory, projectName, createDirectoryIfNotExists } = params;
    const packageDirectory = `${directory}/${projectName}`;
    if (createDirectoryIfNotExists) {
      await runCommands([`mkdir -p ${packageDirectory}`]);
    }
    await runCommands([`cd ${packageDirectory} && npm init -y`]);
    const packageJSON = new PackageJSON(packageDirectory);
    const packageJSONParams: Partial<PackageJSONSchema> = {
      name: projectName,
    };
    if (params.version) {
      packageJSONParams.version = params.version;
    }
    if (params.description) {
      packageJSONParams.description = params.description;
    }
    if (params.main) {
      packageJSONParams.main = params.main;
    }
    if (params.scripts) {
      packageJSONParams.scripts = params.scripts;
    }
    if (params.dependencies) {
      packageJSONParams.dependencies = params.dependencies;
    }
    if (params.devDependencies) {
      packageJSONParams.devDependencies = params.devDependencies;
    }
    await packageJSON.updatePackageJSON(packageJSONParams);
    if (params.dependencies || params.devDependencies) {
      await packageJSON.install();
    }
    return packageJSON;
  }
}
