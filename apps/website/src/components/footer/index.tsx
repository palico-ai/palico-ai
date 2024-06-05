'use client';

import { Box, Divider } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <Box>
      <Divider
        sx={{
          opacity: 0.5,
        }}
      />
      <Box>
        <Typography textAlign={'center'} p={2}>
          © {new Date().getFullYear()} Palico AI Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
