'use client';

import { AppBar, Box, Toolbar } from '@mui/material';
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
        <Box sx={{ flexGrow: 1 }} />
        <Box>{rightNavItems}</Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
