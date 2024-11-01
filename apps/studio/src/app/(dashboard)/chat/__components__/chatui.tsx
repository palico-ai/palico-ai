'use client';

import { Box, Divider, Stack } from '@mui/material';
import React, { useContext } from 'react';
import { ChatHistory } from './chat_history';
import { ChatInput } from './chat_input';
import { ConversationContext } from '../../../../context/conversation';
import { useChat } from '@palico-ai/react';

const ChatUI: React.FC = () => {
  const { agentName } = useContext(ConversationContext);
  const { sendMessage, loading, messages } = useChat({
    agentName: agentName ?? '',
    apiURL: '/api/palico',
  });

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingX: 2,
        }}
      >
        <ChatHistory
          initialMessage={'Welcome to the chat!'}
          history={messages}
        />
      </Box>
      <Divider />
      <Box>
        <ChatInput
          disabled={loading}
          placeholder={'Begin by typing a message'}
          onSend={sendMessage}
        />
      </Box>
    </Stack>
  );
};

export default ChatUI;
