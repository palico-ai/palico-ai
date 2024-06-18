import { Box, Typography } from '@mui/material';
import { Button, Link } from '@palico-ai/components';
import RoutePath from '../../../utils/route_path';
import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h1" gutterBottom>
        Coming Soon (~Week of June 25)
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Link href={RoutePath.newsletter()}>
          <Button variant="contained" color="primary">
            Subcribe to Newsletter
          </Button>
        </Link>
        <Link href="/">
          <Button variant="text" color="primary">
            Go Back
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default DocsPage;
