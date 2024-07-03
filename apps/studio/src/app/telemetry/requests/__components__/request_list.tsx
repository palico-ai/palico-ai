'use client';

import React, { useMemo } from 'react';
import {
  List,
  Button,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@palico-ai/components';
import { ConversationRequestTelemetryItem } from '@palico-ai/common';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../../utils/route_path';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RECENT_REQUEST_TELEMETRIES } from '../../../../constants/query_keys';
import { getRecentRequests } from '../../../../services/telemetry';
import { Box, Skeleton } from '@mui/material';
import { useSelectedRequestId } from '../context';

const RequestListItem: React.FC<ConversationRequestTelemetryItem> = ({
  requestId,
  createdAt,
}) => {
  const router = useRouter();
  const selectedRequestId = useSelectedRequestId();

  const handleSelectRequest = (requestId: string) => {
    router.push(
      RoutePath.requestTraceItem({
        requestId,
      })
    );
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => handleSelectRequest(requestId)}
        selected={selectedRequestId === requestId}
      >
        <ListItemText
          primary={
            <Typography variant="body1" noWrap>
              {requestId}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {new Date(createdAt).toLocaleString()}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

const RequestTelemetryList: React.FC = () => {
  const {
    data: requestListData,
    error: requestListError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: [RECENT_REQUEST_TELEMETRIES],
    queryFn: async ({ pageParam }) => {
      const response = await getRecentRequests(pageParam);
      return response;
    },
    initialPageParam: {
      limit: 20,
      offset: 0,
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const listItemFlattened = useMemo(() => {
    return requestListData?.pages.flatMap((page) => page.items) ?? [];
  }, [requestListData]);

  if (isPending) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="rectangular" height="100%" width="100%" />
      </Box>
    );
  }

  if (requestListError) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" color={'error'}>
          Error fetching request list
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List dense disablePadding>
        {listItemFlattened.map((request, index) => (
          <RequestListItem key={index} {...request} />
        ))}
      </List>
      {hasNextPage ? (
        <Box px={0} pt={2} pb={8}>
          <Button
            color="secondary"
            variant="contained"
            fullWidth
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default RequestTelemetryList;