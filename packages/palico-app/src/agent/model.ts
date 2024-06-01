import Project from '../utils/project';
import OS from '../utils/os';
import { LLMAgent } from './types';

export class AgentModel {
  private static readonly agentFile = 'index.ts';

  static async getAllAgents(): Promise<string[]> {
    const agentDirName = await Project.getAgentRootDir();
    const dirs = await OS.getDirectories(agentDirName);
    const agents = dirs.filter((dir) =>
      OS.doesFileExist(`${agentDirName}/${dir}/${AgentModel.agentFile}`)
    );
    return agents;
  }

  static async doesAgentExist(name: string): Promise<boolean> {
    const filePath = await AgentModel.agentFilePath(name);
    return OS.doesFileExist(filePath);
  }

  static async getAgentByName(name: string) : Promise<LLMAgent> {
    const filePath = await AgentModel.agentFilePath(name);
    const agentExports = await import(filePath);
    const agent = new agentExports.default();
    return agent;
  }

  private static async agentFilePath(name: string): Promise<string> {
    const agentDirName = await Project.getAgentRootDir();
    return `${agentDirName}/${name}/${AgentModel.agentFile}`;
  }
}
