import findup from 'find-up'

// This class is used to work with the file system of the project from package.json level
export default class Project {
  private static projectPath: string

  static async getWorkspaceRootDir (): Promise<string> {
    if (this.projectPath) {
      return this.projectPath
    }
    const fullPath = await findup("package.json")
    const path = fullPath?.replace(/\/package.json$/, '')
    if (!path) {
      throw new Error('Failed to find project root')
    }
    this.projectPath = path
    return path
  }

  static async getExperimentRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir()
    return `${root}/src/experiments`
  }

  static async getDatasetRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir()
    return `${root}/src/datasets`
  }

  static async metricsRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir()
    return `${root}/src/metrics`
  }

  static async getWorkflowRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir()
    return `${root}/src/workflows`
  }

  static async getAgentRootDir(): Promise<string> {
    const root = await this.getWorkspaceRootDir()
    return `${root}/src/agents`
  }
}