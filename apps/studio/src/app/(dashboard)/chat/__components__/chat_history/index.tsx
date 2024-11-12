'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';

import { Message } from '@palico-ai/react';
import ChatListItem from './chat_list_item';
import { ChatListItemWrapper } from './shared';
import { Typography } from '@palico-ai/components';

export interface ChatHistoryProps {
  initialMessage?: string;
  history: Message[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
  initialMessage,
}) => {
  const [lastMessageEl, setLastMessageEl] =
    React.useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageEl) {
      lastMessageEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [history, lastMessageEl]);

  return (
    <Box>
      {history.length === 0 && initialMessage && (
        <ChatListItemWrapper label="System" align="flex-start">
          <Typography variant="body1">{initialMessage}</Typography>
        </ChatListItemWrapper>
      )}
      {history.map((message, index) => {
        const isLastMessage = index === history.length - 1;
        return (
          <ChatListItem
            key={index}
            itemRef={isLastMessage ? setLastMessageEl : undefined}
            {...message}
          />
        );
      })}
    </Box>
  );
};
