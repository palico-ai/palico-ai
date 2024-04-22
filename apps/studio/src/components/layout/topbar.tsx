'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from '@palico-ai/components';
import React from 'react';

interface TopbarProps {
  rightNavItems?: React.ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ rightNavItems }) => {
  return (
    <AppBar
      position="static"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Link href="/">
          <Typography variant="h6" noWrap component="div">
            Palico Studio
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Box>{rightNavItems}</Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
