import { SimpleChatHistoryTable } from '../services/database/tables';

interface NewChatHistoryParams<MessageSchema> {
  conversationId: string;
  messages: MessageSchema[];
}

export interface ChatHistoryFromConversationParams {
  /**
   * Conversation ID Create or Retrieve Chat History
   */
  conversationId: string;
  /**
   * If a value is passed in, will skip check to see if conversation exists
   */
  isNewConversation?: boolean;
}

/**
 * Presistant Storage for Chat History.
 *
 * @template MessageSchema - The schema of the messages in the chat history.
 */
export class ChatHistory<MessageSchema> {
  /**
   * The unique identifier for the conversation.
   */
  readonly conversationId: string;

  /**
   * The list of messages in the chat history.
   */
  private _messages: MessageSchema[];

  /**
   * Creates an instance of ChatHistory.
   *
   * @param params - The parameters for creating a new chat history.
   * @param params.conversationId - The unique identifier for the conversation.
   * @param params.messages - The initial list of messages in the chat history.
   */
  private constructor(params: NewChatHistoryParams<MessageSchema>) {
    this.conversationId = params.conversationId;
    this._messages = params.messages;
  }

  /**
   * Gets the list of messages in the chat history.
   *
   * @returns The list of messages.
   */
  get messages(): MessageSchema[] {
    return this._messages;
  }

  /**
   * Appends a new message to the chat history.
   *
   * @param message - The message to append.
   * @returns The updated ChatHistory instance.
   */
  append(message: MessageSchema) {
    this._messages.push(message);
    return this;
  }

  /**
   * Sets the list of messages in the chat history.
   *
   * @param messages - The new list of messages.
   * @returns The updated ChatHistory instance.
   */
  setMessages(messages: MessageSchema[]) {
    this._messages = messages;
    return this;
  }

  /**
   * Saves the current chat history to the database.
   *
   * @returns A promise that resolves when the save operation is complete.
   */
  async save() {
    await SimpleChatHistoryTable.update(
      {
        messagesJSON: JSON.stringify(this._messages),
      },
      { where: { conversationId: this.conversationId } }
    );
  }

  /**
   * Creates a new chat history for a conversation.
   *
   * @template MessageSchema - The schema of the messages in the chat history.
   * @param conversationId - The unique identifier for the conversation.
   * @returns A promise that resolves to the new ChatHistory instance.
   */
  private static async createAsNew<MessageSchema>(
    conversationId: string
  ): Promise<ChatHistory<MessageSchema>> {
    await SimpleChatHistoryTable.create({
      conversationId: conversationId,
      messagesJSON: JSON.stringify([]),
    });
    return new ChatHistory({
      conversationId,
      messages: [],
    });
  }

  /**
   * Retrieves the chat history for a conversation.
   *
   * @template MessageSchema - The schema of the messages in the chat history.
   * @param params - The parameters for retrieving the chat history.
   * @param params.conversationId - The unique identifier for the conversation.
   * @param params.isNewConversation - Whether the conversation is new.
   * @returns A promise that resolves to the ChatHistory instance.
   */
  static async fromConversation<MessageSchema>(
    params: ChatHistoryFromConversationParams
  ): Promise<ChatHistory<MessageSchema>> {
    const { conversationId, isNewConversation } = params;
    if (isNewConversation) {
      const history = await ChatHistory.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    const currentHistory = await SimpleChatHistoryTable.findByPk(
      conversationId
    );
    if (!currentHistory) {
      const history = await ChatHistory.createAsNew<MessageSchema>(
        conversationId
      );
      return history;
    }
    return new ChatHistory({
      conversationId,
      messages: JSON.parse(currentHistory.dataValues.messagesJSON),
    });
  }
}
