import { JSONAbleObject } from '@palico-ai/common';
import { SimpleChatHistoryTable } from '../services/database/tables';

/**
 * Creates a new conversation state in persistent storage.
 * @param conversationId - Conversation related to the state.
 * @param state - The state object to be saved
 */
export const createConversationState = async <Schema = JSONAbleObject>(
  conversationId: string,
  state: Schema
) => {
  await SimpleChatHistoryTable.create({
    conversationId,
    messagesJSON: JSON.stringify(state),
  });
};

/**
 * Retrieves the state of a conversation from persistent storage.
 * @param conversationId Conversation ID associated with the State
 * @returns The saved state of the conversation
 */
export const getConversationState = async <Schema = JSONAbleObject>(
  conversationId: string
): Promise<Schema> => {
  const stateEntry = await SimpleChatHistoryTable.findByPk(conversationId);
  if (!stateEntry) {
    throw new Error('Record not found');
  }
  return JSON.parse(stateEntry.dataValues.messagesJSON);
};

/**
 * Updates the state of a conversation in persistent storage.
 * @param conversationId - Conversation ID associated with the State
 * @param state - The new state object to be saved
 * @returns A promise that resolves when the state has been updated
 */
export const updateConversationState = async <Schema = JSONAbleObject>(
  conversationId: string,
  state: Schema
) => {
  const result = await SimpleChatHistoryTable.update(
    {
      messagesJSON: JSON.stringify(state),
    },
    { where: { conversationId } }
  );
  if (result[0] === 0) {
    throw new Error('Record not found');
  }
};

/**
 * Sets the state of a conversation in presistent storage.
 * If the conversation does not exist, it will be created.
 *
 * @template Schema - The type of the state object, defaults to JSONAbleObject.
 * @param {string} conversationId - The unique identifier of the conversation.
 * @param {Schema} state - The state object to be set for the conversation.
 * @returns {Promise<void>} A promise that resolves when the state has been set.
 */
export const setConversationState = async <Schema = JSONAbleObject>(
  conversationId: string,
  state: Schema
): Promise<void> => {
  const currentState = await SimpleChatHistoryTable.findByPk(conversationId);
  if (!currentState) {
    await createConversationState(conversationId, state);
  } else {
    await updateConversationState(conversationId, state);
  }
};
