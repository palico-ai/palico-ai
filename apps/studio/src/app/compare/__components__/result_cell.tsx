import { Box, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import React from 'react';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useExpTestResult } from './hooks';

interface ResultCellParams {
  experimentId: string;
  testId: string;
}

const ResultCell: React.FC<ResultCellParams> = ({ experimentId, testId }) => {
  const { result, runTest } = useExpTestResult(experimentId, testId);
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
          {result?.status === 'RUNNING' && (
            <Box
              sx={{
                width: '100%',
              }}
            >
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          )}
          {result?.message && (
            <Typography variant="body2">
              {result?.message ?? 'Unknown'}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton
            size="small"
            color="secondary"
            onClick={runTest}
            disabled={result?.status === 'RUNNING'}
          >
            <RunIcon />
          </IconButton>
        </Box>
      </Paper>
    </td>
  );
};

export default ResultCell;
