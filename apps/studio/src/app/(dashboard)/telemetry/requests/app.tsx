'use client';

import React from 'react';
import RequestTelemetryList from './__components__/request_list';
import { Box } from '@mui/system';
import RequestPanel from './__components__/request_detail';
import { useSelectedRequestId } from './context';
import { Typography } from '@palico-ai/components';
import PageContent from '../../../../components/layout/page_content';
import { RoutePath } from '../../../../utils/route_path';
import { Grid } from '@mui/material';

const UnselectedRequestPanelView: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography textAlign={'center'} variant="subtitle1">
        Select a request to view traces
      </Typography>
    </Box>
  );
};

const RequestTelemetryApp: React.FC = () => {
  const selectedRequestId = useSelectedRequestId();

  return (
    <PageContent
      disablePadding
      breadcrumb={[
        {
          label: 'Recent Requests',
          href: RoutePath.requestTraceList(),
        },
        ...(selectedRequestId ? [{ label: selectedRequestId }] : []),
      ]}
    >
      <Grid
        container
        sx={{
          height: '100%',
        }}
      >
        <Grid
          item
          xs={selectedRequestId ? 2 : 3}
          sx={(theme) => ({
            height: '100%',
            overflowY: 'auto',
            borderRight: `1px solid ${theme.palette.divider}`,
          })}
        >
          <RequestTelemetryList />
        </Grid>
        <Grid
          item
          xs={selectedRequestId ? 10 : 9}
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {selectedRequestId ? (
            <RequestPanel selectedRequestId={selectedRequestId} />
          ) : (
            <UnselectedRequestPanelView />
          )}
        </Grid>
      </Grid>
    </PageContent>
  );
};

export default RequestTelemetryApp;
