export interface ConversationModel {
  id: string;
  history: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
}

export class LLMHistoryTable {
  constructor() {
    console.log('ConversationHistoryModel created');
  }

  async findById(id: string) {
    return {
      id,
      history: [],
    };
  }

  async create(history: ConversationModel) : Promise<ConversationModel> {
    return history;
  }

  async update(history: ConversationModel) : Promise<ConversationModel> {
    return history;
  }
}