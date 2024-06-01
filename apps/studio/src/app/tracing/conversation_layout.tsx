'use client';

import { Box, Typography } from '@mui/material';
import {
  ConversationTraces,
  ConversationTracesWithoutRequests,
} from '@palico-ai/common';
import React from 'react';
import ConversationList from './list';
import { Button } from '@palico-ai/components';
import useFetchConversation from './use_fetch_conversation';
import { getTracesForConversation } from '../../services/telemetry';
import ConversationDetail from './conversation_detail';

interface ConversationListProps {
  initialConversations: ConversationTracesWithoutRequests[];
  limit: number;
  offset: number;
}

const ConversationLayout: React.FC<ConversationListProps> = ({
  initialConversations,
  limit,
  offset,
}) => {
  const [selectedConversation, setSelectedConversation] =
    React.useState<ConversationTraces>();

  const {
    conversations,
    fetchMore: loadMore,
    loading,
    hasMore,
  } = useFetchConversation({
    pagination: {
      limit,
      offset,
    },
    initialConversations,
  });

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = await getTracesForConversation(conversationId);
    setSelectedConversation(conversation);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        flex={3}
        sx={{
          height: '100%',
          overflowY: 'scroll',
          pb: 2,
          boxSizing: 'border-box',
        }}
      >
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.conversationId}
        />
        {hasMore && (
          <Button sx={{ mt: 2 }} onClick={loadMore} fullWidth loading={loading}>
            Load More
          </Button>
        )}
      </Box>
      <Box flex={9}>
        {!selectedConversation ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography textAlign={'center'} variant="subtitle1">
              Select a conversation to view details
            </Typography>
          </Box>
        ) : (
          <ConversationDetail conversation={selectedConversation} />
        )}
      </Box>
    </Box>
  );
};

export default ConversationLayout;
