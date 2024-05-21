import { AgentRequestCreateParams, AgentRequestTable } from '../services/database/tables';
import Project from '../utils/project';
import OS from '../utils/os';

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

  static async getAgentByName(name: string) {
    const filePath = await AgentModel.agentFilePath(name);
    const agentExports = await import(filePath);
    const agent = new agentExports.default();
    return agent;
  }

  static async logRequest(params: AgentRequestCreateParams) {
    const response = await AgentRequestTable.create({
      id: params.id,
      agentId: params.agentId,
      conversationId: params.conversationId,
      requestTraceId: params.requestTraceId,
    });
    return response.dataValues;
  }

  static async getTracesByConversationId(
    conversationId: string
  ): Promise<string[]> {
    const results = await AgentRequestTable.findAll({
      where: {
        conversationId,
      },
    });
    return results.map((result) => result.dataValues.requestTraceId);
  }

  private static async agentFilePath(name: string): Promise<string> {
    const agentDirName = await Project.getAgentRootDir();
    return `${agentDirName}/${name}/${AgentModel.agentFile}`;
  }
}
