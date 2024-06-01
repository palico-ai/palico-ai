'use client';

import { ListItem } from '@mui/material';
import { ConversationTracesWithoutRequests } from '@palico-ai/common';
import { List, ListItemText, ListItemButton } from '@palico-ai/components';
import React from 'react';

interface ConversationListParams {
  conversations: ConversationTracesWithoutRequests[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListParams> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  return (
    <List disablePadding>
      {conversations.map((conversation, index) => (
        <ListItem
          key={conversation.conversationId}
          disablePadding
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <ListItemButton
            onClick={() => onSelectConversation(conversation.conversationId)}
            selected={conversation.conversationId === selectedConversationId}
          >
            <ListItemText
              primary={conversation.agentName ?? conversation.workflowName}
              secondary={new Date(conversation.createdAt).toLocaleString()}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ConversationList;
