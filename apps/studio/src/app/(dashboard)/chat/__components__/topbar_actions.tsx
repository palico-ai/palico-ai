'use client';

import { Box, MenuItem, TextField } from '@mui/material';
import { ConversationContext } from '../../../../context/conversation';
import React, { useContext } from 'react';
import { ConversationalEntity } from '../../../../types/common';

export interface TopbarAgentParams {
  conversationEntities: ConversationalEntity[];
}

const TopbarActions: React.FC<TopbarAgentParams> = ({
  conversationEntities,
}) => {
  const { conversationEntity: activeEntity, setConversationalEntity } =
    useContext(ConversationContext);
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <TextField
        required
        variant="standard"
        onChange={(e) => {
          const stringifiedEntity = e.target.value;
          if (stringifiedEntity.length === 0) {
            return;
          }
          const entity = JSON.parse(stringifiedEntity);
          setConversationalEntity(entity);
        }}
        size="small"
        sx={{
          minWidth: '150px',
        }}
        select
        value={JSON.stringify(activeEntity)}
        label="AgentID"
      >
        {conversationEntities.map((entity, index) => (
          <MenuItem key={index} value={JSON.stringify(entity)}>
            {entity.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default TopbarActions;
