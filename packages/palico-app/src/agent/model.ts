import Project from '../utils/project';
import OS from '../utils/os';
import { ChatRequestHandler } from './chat';

export class AgentModel {
  private static readonly agentFile = 'chat.ts';

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

  static async getAgentByName(name: string): Promise<ChatRequestHandler> {
    const filePath = await AgentModel.agentFilePath(name);
    const agentExports = await import(filePath);
    return agentExports.default;
  }

  private static async agentFilePath(name: string): Promise<string> {
    const agentDirName = await Project.getAgentRootDir();
    return `${agentDirName}/${name}/${AgentModel.agentFile}`;
  }
}
