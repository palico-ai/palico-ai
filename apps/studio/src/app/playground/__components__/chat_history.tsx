'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content?: string;
}

export interface ChatHistoryProps {
  initialMessage?: string;
  history: ChatMessage[];
}

interface ChatListItemProps extends ChatMessage {
  itemRef?: React.Ref<unknown> | undefined;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  role,
  content,
  itemRef: ref,
}) => {
  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: 2,
        mb: 1,
        px: 2,
        py: 1,
      }}
    >
      <Typography variant="body1" fontWeight={"bold"} sx={{ color: 'text.secondary' }}>
        {role === 'user' ? 'You' : 'Assistant'}
      </Typography>
      <Typography variant="body1">{content}</Typography>
    </Box>
  );
};

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
  }, [lastMessageEl]);

  return (
    <Box>
      {history.length === 0 && initialMessage && (
        <ChatListItem
          // eslint-disable-next-line jsx-a11y/aria-role
          role="assistant"
          content={initialMessage}
          itemRef={setLastMessageEl}
        />
      )}
      {history.map((conversation, index) => {
        const isLastMessage = index === history.length - 1;
        return (
          <ChatListItem
            key={index}
            role={conversation.role}
            content={conversation.content ?? 'Invalid message'}
            itemRef={isLastMessage ? setLastMessageEl : undefined}
          />
        );
      })}
    </Box>
  );
};
