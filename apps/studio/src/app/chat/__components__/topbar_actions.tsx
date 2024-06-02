'use client';

import { Box, MenuItem, TextField } from '@mui/material';
import { ConversationContext } from '../../../context/conversation';
import React, { useContext } from 'react';

export interface TopbarAgentParams {
  agentIds: string[]
}

const TopbarActions: React.FC<TopbarAgentParams> = ({
  agentIds
}) => {
  const {
    agentId,
    setAgentId
  } = useContext(ConversationContext)
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <TextField
        required
        variant="standard"
        onChange={e => {
          setAgentId(e.target.value)
        }}
        size="small"
        sx={{
          minWidth: '150px',
        }}
        select
        value={agentId}
        label="AgentID"
      >
        {agentIds.map((id) => (
          <MenuItem key={id} value={id}>
            {id}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default TopbarActions;
