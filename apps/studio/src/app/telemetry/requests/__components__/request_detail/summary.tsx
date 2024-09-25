import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { REQUEST_TELEMETRY } from '../../../../../constants/query_keys';
import React from 'react';
import { getRequestTelemetry } from '../../../../../services/telemetry';
import {
  Editor,
  ErrorMessage,
  Skeleton,
  TabPanel,
  TabView,
  Typography,
} from '@palico-ai/components';
import { ConversationRequestTelemetryItem } from '@palico-ai/common';

export interface RequestSummaryProps {
  requestId: string;
}

enum TabValue {
  REQUEST_IO = 'requestIo',
  APP_CONFIG = 'appConfig',
}

const [EDITOR_MIN_HEIGHT, EDITOR_MAX_HEIGHT] = [150, 300];

const EditorSnippet: React.FC<{ value: Record<any, any> }> = ({ value }) => {
  return (
    <Editor
      value={JSON.stringify(value, null, 2)}
      autoReizeMinHeight={EDITOR_MIN_HEIGHT}
      autoReizeMaxHeight={EDITOR_MAX_HEIGHT}
      language="json"
      options={{
        readOnly: true,
        wordWrap: 'on',
        minimap: { enabled: false },
      }}
    />
  );
};

const CodeSnippetTabs: React.FC<
  Pick<
    ConversationRequestTelemetryItem,
    'requestInput' | 'responseOutput' | 'appConfig'
  >
> = ({ requestInput, responseOutput, appConfig }) => {
  return (
    <TabView
      indicatorColor="secondary"
      tabs={[
        { label: 'Input / Output', value: TabValue.REQUEST_IO },
        { label: 'App Config', value: TabValue.APP_CONFIG },
      ]}
    >
      <TabPanel value={TabValue.REQUEST_IO}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight={'bold'}>
              Request Input
            </Typography>
            <Typography variant="body1" fontWeight={100}>
              <EditorSnippet value={requestInput} />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight={'bold'}>
              Response Output
            </Typography>
            <EditorSnippet value={responseOutput} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={TabValue.APP_CONFIG}>
        <Typography variant="body1" fontWeight={'bold'}>
          App Config
        </Typography>
        <EditorSnippet value={appConfig} />
      </TabPanel>
    </TabView>
  );
};

const RequestSummary: React.FC<RequestSummaryProps> = ({ requestId }) => {
  const {
    data,
    isPending: pendingRequestTelemetry,
    error: requestTelemetryError,
  } = useQuery({
    queryKey: [REQUEST_TELEMETRY, requestId],
    queryFn: async () => {
      const response = await getRequestTelemetry(requestId);
      return response;
    },
  });

  if (requestTelemetryError) {
    return (
      <ErrorMessage
        centerInContainer
        message="Failed to fetch request telemetry"
      />
    );
  }

  if (pendingRequestTelemetry || !data) {
    return <Skeleton height={350} />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="body1" fontWeight={'bold'}>
          Conversation ID
        </Typography>
        <Typography variant="body1" fontWeight={100}>
          {data.conversationId}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1" fontWeight={'bold'}>
          Created At
        </Typography>
        <Typography variant="body1" fontWeight={100}>
          {new Date(data.createdAt).toLocaleString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CodeSnippetTabs
          requestInput={data.requestInput}
          responseOutput={data.responseOutput}
          appConfig={data.appConfig}
        />
      </Grid>
    </Grid>
  );
};

export default RequestSummary;
