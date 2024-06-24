import findup from 'find-up';

// This class is used to work with the file system of the project from package.json level
export default class Project {
  private static projectPath: string;

  static async getWorkspaceRootDir(): Promise<string> {
    if (this.projectPath) {
      return this.projectPath;
    }
    const fullPath = await findup('package.json');
    const path = fullPath?.replace(/\/package.json$/, '');
    if (!path) {
      throw new Error('Failed to find project root');
    }
    this.projectPath = path;
    return path;
  }

  static async getExperimentRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/appdata/experiments`;
  }

  static async getPalicoTempDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/.palico`;
  }

  static async getQuickLabRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/appdata/quicklabs`;
  }

  static async getTestSuiteRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/src/eval_tests`;
  }

  static async getWorkflowRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/src/workflows`;
  }

  static async getAgentRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/src/agents`;
  }

  static async getPalicoAppNodeModulesDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir();
    return `${root}/node_modules/@palico-ai/app`;
  }

  static async validatePathWithinProject(path: string): Promise<void> {
    const root = await this.getWorkspaceRootDir();
    if (!path.startsWith(root)) {
      throw new Error(`Path ${path} is not within the project`);
    }
  }
}
