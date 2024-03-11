import * as findUp from 'find-up'
import { readFileSync } from 'fs'
import { type SimpleApplicationConfig, type PackageConfig } from '../app/types'
import config from '../config'
import { RunShellCommands } from './os'
import { ZipDirectory } from './create_zip'

export interface ApplicationBundle {
  bundlePath: string
  metadata: {
    appEntryPath: string
  }
}

export class CurrentProject {
  private static hasBuiltApplication: boolean = false
  private static projectPath: string
  private static projectConfig: PackageConfig
  private static applicationConfig: any

  static async getPackageDirectory (): Promise<string> {
    if (this.projectPath) {
      return this.projectPath
    }
    const path = await findUp(config.ProjectConfigFileName)
    if (!path) {
      throw new Error('Failed to find project root')
    }
    this.projectPath = path.replace(`/${config.ProjectConfigFileName}`, '')
    return this.projectPath
  }

  static async getPackageConfig (): Promise<PackageConfig> {
    if (this.projectConfig) {
      return this.projectConfig
    }
    const projectRootPath = await this.getPackageDirectory()
    this.projectConfig = JSON.parse(
      readFileSync(`${projectRootPath}/${config.ProjectConfigFileName}`, 'utf8')
    )
    return this.projectConfig
  }

  static async buildApplication (): Promise<void> {
    if (this.hasBuiltApplication) {
      return
    }
    const config = await this.getPackageConfig()
    const buildCommands = config.app.build
    if (buildCommands && buildCommands.length > 0) {
      await RunShellCommands(buildCommands)
    }
    this.hasBuiltApplication = true
  }

  static async createApplicationBundle (): Promise<ApplicationBundle> {
    await this.buildApplication()
    const {
      include,
      app: { entryPath }
    } = await CurrentProject.getPackageConfig()
    const packageRootPath = await CurrentProject.getPackageDirectory()
    const packageBundlePath = await CurrentProject.getPackageBundlePath()
    await ZipDirectory(packageRootPath, packageBundlePath, {
      files: [
        ...include.files,
        config.ProjectConfigFileName
      ],
      directories: include.directories
    })
    return {
      bundlePath: packageBundlePath,
      metadata: {
        appEntryPath: entryPath
      }
    }
  }

  static async getApplicationAPIConfig (): Promise<SimpleApplicationConfig> {
    if (this.applicationConfig) {
      return this.applicationConfig
    }
    const projectRootPath = await this.getPackageDirectory()
    const config = await this.getPackageConfig()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.applicationConfig = require(`${projectRootPath}/${config.app.entryPath}`).default
    return this.applicationConfig
  }

  static async getPackageBundlePath (): Promise<string> {
    const projectRootPath = await this.getPackageDirectory()
    const bundlePath = `${projectRootPath}/${config.TempDirectory}/${config.BundleFileKey}`
    return bundlePath
  }
}
