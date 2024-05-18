import {
  Box,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useExpTestResult } from '../hooks';
import { LabExperimentTestResult } from '@palico-ai/common';
import { TabPanel, TabView, Chip, Link } from '@palico-ai/components';
import LabItemViewConfig from '../constants';

interface ResultCellParams {
  experimentId: string;
  testId: string;
}

export const MAX_WIDTH = '400px';

const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    }}
  >
    <Skeleton sx={{ width: '100%' }} />
    <Skeleton animation="wave" sx={{ width: '100%' }} />
    <Skeleton animation={false} sx={{ width: '100%' }} />
  </Box>
);

const ResultDetails: React.FC<LabExperimentTestResult> = ({
  status,
  message,
  metricResults,
}) => {
  if (status === 'RUNNING') {
    return;
  }
  return (
    <TabView
      tabs={[
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Metrics',
          value: 'metrics',
        },
      ]}
    >
      <TabPanel value="message">
        <Box
          sx={{
            minHeight: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
            maxHeight: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
            overflowY: 'auto',
          }}
        >
          <Typography variant="body2" whiteSpace={'pre-line'}>
            {message}
          </Typography>
        </Box>
      </TabPanel>
      <TabPanel value="metrics">
        {metricResults && (
          <Box
            sx={{
              minHeight: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
              maxHeight: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Grid container direction={'column'} spacing={1}>
              {metricResults.map((metric) => (
                <Grid item key={metric.name}>
                  <Chip label={`${metric.name}: ${metric.value}`} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </TabPanel>
    </TabView>
  );
};

const ResultCell: React.FC<ResultCellParams> = ({ experimentId, testId }) => {
  const { result, runTest } = useExpTestResult(experimentId, testId);

  const contentJSX = useMemo(() => {
    if (result?.status === 'RUNNING') {
      return <Loading />;
    }
    if (result?.message) {
      return <ResultDetails {...result} />;
    }
    return;
  }, [result]);

  return (
    <td
      style={{
        height: 'inherit',
        maxWidth: MAX_WIDTH,
        overflow: 'auto',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 1,
          boxSizing: 'border-box',
        }}
      >
        <Box px={1}>{contentJSX}</Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {result?.metadata?.traceId && (
            <Link
              href={'http://localhost:16686/trace/' + result.metadata.traceId}
              target="_blank"
            >
              <Chip size="small" label="Traces" />
            </Link>
          )}
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
