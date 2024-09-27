import { useQuery } from '@tanstack/react-query';
import { REQUEST_LOGS } from '../../../../../../constants/query_keys';
import React, { useMemo } from 'react';
import { getRequestLogs } from '../../../../../../services/telemetry';
import { Editor, ErrorMessage, Skeleton } from '@palico-ai/components';
import { Box } from '@mui/material';

interface RequestLogsProps {
  requestId: string;
}

const RequestLogs: React.FC<RequestLogsProps> = ({ requestId }) => {
  const { data, isPending, error } = useQuery({
    queryKey: [REQUEST_LOGS, requestId],
    queryFn: async () => {
      // fetch request logs
      const response = await getRequestLogs(requestId);
      return response;
    },
  });

  const logMessages = useMemo(() => {
    const messages = data?.logs.map((log) => {
      return `${log.timestamp} - ${log.type}: ${log.message}`;
    });

    return messages?.join('\n');
  }, [data]);

  if (isPending) {
    return (
      <Box
        sx={{
          height: '20vh',
        }}
      >
        <Skeleton count={5} />
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <Editor
      value={logMessages}
      options={{
        readOnly: true,
        wordWrap: 'on',
        minimap: {
          enabled: false,
        },
        fontSize: 12,
      }}
      language={'plaintext'}
      autoReizeMaxHeight={500}
      autoReizeMinHeight={200}
    />
  );
};

export default RequestLogs;
