'use client';

import { useQuery } from '@tanstack/react-query';
import { API_HEALTH_CHECK } from '../constants/query_keys';
import { healthCheck } from '../services/health_check';
import {
  ComponentWithChildren,
  ErrorMessage,
  Typography,
} from '@palico-ai/components';
import { Box } from '@mui/material';

export const WithHealthyAPI: React.FC<ComponentWithChildren> = ({
  children,
}) => {
  const { data: isApiHealthy, isPending } = useQuery({
    queryKey: [API_HEALTH_CHECK],
    queryFn: async () => {
      try {
        await healthCheck();
        return true;
      } catch (error) {
        return false;
      }
    },
  });

  if (isPending) {
    return (
      <Box
        sx={{
          height: '100vh',
          // backgroundColor: 'default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">API Health Check...</Typography>
      </Box>
    );
  }

  if (isApiHealthy) {
    return <>{children}</>;
  } else {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ErrorMessage message="API Connection Failed" />
      </Box>
    );
  }
};
