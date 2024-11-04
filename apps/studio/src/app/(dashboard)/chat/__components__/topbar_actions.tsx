'use client';

import { Box, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryParam, RoutePath } from '../../../../utils/route_path';

export interface TopbarAgentParams {
  agents: string[];
}

const TopbarActions: React.FC<TopbarAgentParams> = ({ agents }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <TextField
        required
        variant="standard"
        onChange={(e) =>
          router.push(RoutePath.chat({ agentName: e.target.value }))
        }
        size="small"
        sx={{
          minWidth: '150px',
        }}
        select
        value={searchParams.get(QueryParam.AgentName)}
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
