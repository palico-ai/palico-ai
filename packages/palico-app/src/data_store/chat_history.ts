import { SimpleChatHistoryTable } from '../services/database/tables';

interface ChatHistoryConstructorParamsParams<MessageSchema> {
  conversationId: string;
  messages: MessageSchema[];
}

export interface ChatHistoryFromConversationParams {
  conversationId: string;
  isNewConversation?: boolean;
}

export class ChatHistoryStorage<MessageSchema> {
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
  ): Promise<ChatHistoryStorage<MessageSchema>> {
    await SimpleChatHistoryTable.create({
      conversationId: conversationId,
      messagesJSON: JSON.stringify([]),
    });
    return new ChatHistoryStorage({
      conversationId,
      messages: [],
    });
  }

  static async fromConversation<MessageSchema>(
    params: ChatHistoryFromConversationParams
  ): Promise<ChatHistoryStorage<MessageSchema>> {
    const { conversationId, isNewConversation } = params;
    if (isNewConversation) {
      const history = await ChatHistoryStorage.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    const currentHistory = await SimpleChatHistoryTable.findByPk(
      conversationId
    );
    if (!currentHistory) {
      const history = await ChatHistoryStorage.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    return new ChatHistoryStorage({
      conversationId,
      messages: JSON.parse(currentHistory.dataValues.messagesJSON),
    });
  }
}
