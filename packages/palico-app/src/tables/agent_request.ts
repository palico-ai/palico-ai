import { AgentRequestCreateParams, AgentRequestTable } from './db';

export class AgentRequest {
  static async create(params: AgentRequestCreateParams) {
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
}
