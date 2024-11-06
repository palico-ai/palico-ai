'use client';

import { Box, Divider, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { ChatHistory } from './chat_history';
import { ChatInput } from './chat_input';
import { useChat } from '@palico-ai/react';
import { useSearchParams } from 'next/navigation';
import { QueryParam } from '../../../../utils/route_path';
import ToolCallInput from './tool_call_input';

const ChatUI: React.FC = () => {
  const searchParams = useSearchParams();
  const { sendMessage, pendingToolCalls, addResult, loading, messages } =
    useChat({
      agentName: searchParams.get(QueryParam.AgentName) ?? '',
      apiURL: '/api/palico',
    });
  console.log(pendingToolCalls)

  const inputJSX = useMemo(() => {
    if (pendingToolCalls.length) {
      return (
        <ToolCallInput
          pendingToolCalls={pendingToolCalls}
          addResult={addResult}
        />
      );
    }
    return (
      <ChatInput
        disabled={loading}
        placeholder={'Begin by typing a message'}
        onSend={sendMessage}
      />
    );
  }, [pendingToolCalls, addResult, loading, sendMessage]);

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
      <Box>{inputJSX}</Box>
    </Stack>
  );
};

export default ChatUI;
