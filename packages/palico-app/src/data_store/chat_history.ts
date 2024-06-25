import { SimpleChatHistoryTable } from '../services/database/tables';

interface ChatHistoryConstructorParamsParams<MessageSchema> {
  conversationId: string;
  messages: MessageSchema[];
}

export interface ChatHistoryFromConversationParams {
  conversationId: string;
  isNewConversation?: boolean;
}

export class ChatHistoryStore<MessageSchema> {
  readonly conversationId: string;

  private _messages: MessageSchema[];

  private constructor(
    params: ChatHistoryConstructorParamsParams<MessageSchema>
  ) {
    this.conversationId = params.conversationId;
    this._messages = params.messages;
  }

  get messages(): MessageSchema[] {
    return this._messages;
  }

  append(message: MessageSchema) {
    this._messages.push(message);
    return this;
  }

  setMessages(messages: MessageSchema[]) {
    this._messages = messages;
    return this;
  }

  async save() {
    await SimpleChatHistoryTable.update(
      {
        messagesJSON: JSON.stringify(this._messages),
      },
      { where: { conversationId: this.conversationId } }
    );
  }

  private static async createAsNew<MessageSchema>(
    conversationId: string
  ): Promise<ChatHistoryStore<MessageSchema>> {
    await SimpleChatHistoryTable.create({
      conversationId: conversationId,
      messagesJSON: JSON.stringify([]),
    });
    return new ChatHistoryStore({
      conversationId,
      messages: [],
    });
  }

  static async fromConversation<MessageSchema>(
    params: ChatHistoryFromConversationParams
  ): Promise<ChatHistoryStore<MessageSchema>> {
    const { conversationId, isNewConversation } = params;
    if (isNewConversation) {
      const history = await ChatHistoryStore.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    const currentHistory = await SimpleChatHistoryTable.findByPk(
      conversationId
    );
    if (!currentHistory) {
      const history = await ChatHistoryStore.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    return new ChatHistoryStore({
      conversationId,
      messages: JSON.parse(currentHistory.dataValues.messagesJSON),
    });
  }
}
