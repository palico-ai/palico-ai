import findup from 'find-up';
import path from 'path';
import OS from './os';

// This class is used to work with the file system of the project from package.json level
export default class Project {
  private static projectPath: string;

  static async getProjectRootDir(): Promise<string> {
    if (this.projectPath) {
      return this.projectPath;
    }
    const fullPath = await findup('palico.json');
    if (!fullPath) {
      throw new Error('Failed to find project root');
    }
    const workspaceDir = path.dirname(fullPath);
    this.projectPath = workspaceDir;
    return workspaceDir;
  }

  static async getExperimentRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'appdata', 'experiments');
  }

  static async getPalicoTempDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, '.palico');
  }

  static async getQuickLabRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'appdata', 'quicklabs');
  }

  static async getTestSuiteRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'src', 'evals');
  }

  static async getWorkflowRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'src', 'workflows');
  }

  static async getAppScriptRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'src', 'scripts');
  }

  static async getWorkspaceDBPath(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'appdata', 'database.sqlite');
  }

  static async getAgentRootDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'src', 'agents');
  }

  static async getPackageNodeModulesDir(): Promise<string> {
    const root = await this.getProjectRootDir();
    return path.join(root, 'node_modules', '@palico-ai', 'app');
  }

  static async validatePathWithinProject(path: string): Promise<void> {
    const root = await this.getProjectRootDir();
    if (!path.startsWith(root)) {
      throw new Error(`Path ${path} is not within the project`);
    }
  }

  static async isSelfHosted(): Promise<boolean> {
    const root = await this.getProjectRootDir();
    const composeFilePath = path.join(root, 'docker-compose.yml');
    return OS.doesFileExist(composeFilePath);
  }
}
