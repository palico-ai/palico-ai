import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import {
  ConversationAttributes,
  ConversationTable,
} from '../services/sequelize';

interface CreateConversationParams {
  agentId: string;
  history: ChatCompletionMessageParam[];
}

export interface ConversationModel {
  id: number;
  history: ChatCompletionMessageParam[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export default class ConversationHistory {
  static async createConversation(params: CreateConversationParams) {
    const convo = await ConversationTable.create({
      agentId: params.agentId,
      historyJSON: JSON.stringify(params.history),
    });
    return ConversationHistory.parse(convo.dataValues);
  }

  static async getConversation(id: number): Promise<ConversationModel | null> {
    const convo = await ConversationTable.findByPk(id)
    if (!convo) {
      return null;
    }
    return ConversationHistory.parse(convo.dataValues);
  }

  static async updateConversationHistory(id: number, history: ChatCompletionMessageParam[]) {
    await ConversationTable.update(
      { historyJSON: JSON.stringify(history) },
      { where: { id } }
    );
  }

  private static parse(convo: ConversationAttributes): ConversationModel {
    return {
      id: convo.id,
      history: JSON.parse(convo.historyJSON),
      agentId: convo.agentId,
      createdAt: convo.createdAt,
      updatedAt: convo.updatedAt,
    };
  }
}
