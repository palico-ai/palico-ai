import { Box, CardContent, CardHeader, Divider } from '@mui/material';
import React from 'react';
import SpanView from './span_view';
import { Card, ComponentWithChildren, Typography } from '@palico-ai/components';
import RequestSummary from './summary';
import RequestLogs from './request_logs';

interface RequestPanelProps {
  selectedRequestId: string;
}

interface SectionProps extends ComponentWithChildren {
  name: string;
}

const Section: React.FC<SectionProps> = ({ name, children }) => {
  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title={
          <Typography variant="h6" textAlign={'left'}>
            {name}
          </Typography>
        }
      />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const RequestPanel: React.FC<RequestPanelProps> = ({ selectedRequestId }) => {
  return (
    <Box>
      <Section name="Summary">
        <RequestSummary requestId={selectedRequestId} />
      </Section>
      <Section name="Traces">
        <SpanView requestId={selectedRequestId} />
      </Section>
      <Section name="Logs">
        <RequestLogs requestId={selectedRequestId} />
      </Section>
    </Box>
  );
};

export default RequestPanel;
