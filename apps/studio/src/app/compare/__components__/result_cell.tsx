import { Box, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';

interface ResultCellParams {
  result: string;
}

const ResultCell: React.FC<ResultCellParams> = ({ result }) => {
  return (
    <td
      style={{
        height: 'inherit',
      }}
    >
      <Paper
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Typography variant="body2">{result}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton size="small" color="secondary">
            <RunIcon />
          </IconButton>
        </Box>
      </Paper>
    </td>
  );
};

export default ResultCell;
