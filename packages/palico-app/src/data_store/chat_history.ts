import { SimpleChatHistoryTable } from '../services/database/tables';

const createRecord = async <Schema>(
  conversationId: string,
  messages: Schema[]
) => {
  await SimpleChatHistoryTable.create({
    conversationId,
    messagesJSON: JSON.stringify(messages),
  });
};

const getRecord = async <Schema>(conversationId: string) => {
  const history = await SimpleChatHistoryTable.findByPk(conversationId);
  if (!history) {
    throw new Error('Record not found');
  }
  return JSON.parse(history.dataValues.messagesJSON) as Schema[];
};

const updateRecord = async <Schema>(
  conversationId: string,
  messages: Schema[]
) => {
  await SimpleChatHistoryTable.update(
    {
      messagesJSON: JSON.stringify(messages),
    },
    { where: { conversationId } }
  );
};

export const messageRecord = () => ({
  create: createRecord,
  get: getRecord,
  update: updateRecord,
});
