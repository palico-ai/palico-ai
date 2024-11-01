'use client';

import { Box, MenuItem, TextField } from '@mui/material';
import { ConversationContext } from '../../../../context/conversation';
import React, { useContext } from 'react';

export interface TopbarAgentParams {
  agents: string[];
}

const TopbarActions: React.FC<TopbarAgentParams> = ({ agents }) => {
  const { agentName: activeAgent, setAgent } = useContext(ConversationContext);
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <TextField
        required
        variant="standard"
        onChange={(e) => setAgent(e.target.value)}
        size="small"
        sx={{
          minWidth: '150px',
        }}
        select
        value={activeAgent}
        label="AgentID"
      >
        {agents.map((name, index) => (
          <MenuItem key={index} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default TopbarActions;
