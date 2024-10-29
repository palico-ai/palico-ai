import { Box, IconButton, Paper, Skeleton } from '@mui/material';
import React, { useMemo } from 'react';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useBaselineTestResult, useExpTestResult } from '../hooks';
import { LabExperimentTestResult } from '@palico-ai/common';
import {
  TabPanel,
  TabView,
  Chip,
  Link,
  Editor,
  TextDiff,
  Markdown,
} from '@palico-ai/components';
import LabItemViewConfig from '../constants';
import { RoutePath } from '../../../../../../utils/route_path';

interface ResultCellParams {
  experimentId: string;
  testId: string;
}

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

export interface ResultDetailsProps extends LabExperimentTestResult {
  baselineResult?: LabExperimentTestResult;
}

const ResultDetails: React.FC<ResultDetailsProps> = ({
  status,
  message,
  data,
  baselineResult,
}) => {
  const messageContent = useMemo(() => {
    return (
      <Box
        sx={{
          overflowY: 'auto',
          height: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
        }}
      >
        <Markdown>{message ?? ''}</Markdown>
      </Box>
    );
  }, [message]);

  const diffContent = useMemo(() => {
    if (!baselineResult?.message) {
      return messageContent;
    }
    return (
      <Box
        sx={{
          overflowY: 'auto',
          height: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT,
        }}
      >
        <TextDiff
          baseline={baselineResult?.message ?? ''}
          current={message ?? ''}
          variant="body1"
        />
      </Box>
    );
  }, [baselineResult, message, messageContent]);

  if (status === 'RUNNING') {
    return;
  }

  return (
    <TabView
      tabs={[
        {
          label: 'Compare',
          value: 'diff',
        },
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Data',
          value: 'data',
        },
      ]}
    >
      <TabPanel value="message">{messageContent}</TabPanel>
      <TabPanel value="diff">{diffContent}</TabPanel>
      <TabPanel value="data">
        <Editor
          language="json"
          options={{ readOnly: true }}
          height={LabItemViewConfig.TEST_RESULT_CONTENT_MAX_HEIGHT}
          value={JSON.stringify(data, null, 2)}
        />
      </TabPanel>
    </TabView>
  );
};

const ResultCell: React.FC<ResultCellParams> = ({ experimentId, testId }) => {
  const { result, runTest } = useExpTestResult(experimentId, testId);
  const baselineTestResult = useBaselineTestResult(testId);

  const contentJSX = useMemo(() => {
    if (result?.status === 'RUNNING') {
      return <Loading />;
    }
    if (result?.message) {
      return <ResultDetails {...result} baselineResult={baselineTestResult} />;
    }
    return;
  }, [baselineTestResult, result]);

  return (
    <td
      style={{
        height: 'inherit',
        maxWidth: LabItemViewConfig.TEST_RESULT_CONTENT_MAX_WIDTH,
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
        <Box flexGrow={1} px={1}>
          {contentJSX}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {result?.metadata?.requestId && (
            <Link
              href={RoutePath.requestTraceItem({
                requestId: result.metadata.requestId,
              })}
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
