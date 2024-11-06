import React from 'react';
import { Message, MessageSender } from '@palico-ai/react';
import UserChatListItem from './user_chat_list_item';
import AgentChatListItem from './agent_chat_list_item';
import { ChatListItemWrapper } from './shared';

type ChatListItemProps = Message & {
  itemRef?: React.Ref<unknown> | undefined;
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { sender, itemRef } = item;
  return (
    <ChatListItemWrapper
      itemRef={itemRef}
      label={sender === MessageSender.User ? 'User' : 'Agent'}
      align={sender === MessageSender.User ? 'flex-end' : 'flex-start'}
    >
      {sender === MessageSender.User ? (
        <UserChatListItem {...item} />
      ) : (
        <AgentChatListItem {...item} />
      )}
    </ChatListItemWrapper>
  );
};

export default ChatListItem;
