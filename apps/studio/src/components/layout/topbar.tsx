'use client';

import { AppBar, Box, Paper, Toolbar } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

interface TopbarProps {
  leftNavItems?: React.ReactNode;
  rightNavItems?: React.ReactNode;
}

export interface TopbarPageTitleProps {
  title: string;
}

export const TopbarPageTitle: React.FC<TopbarPageTitleProps> = ({ title }) => {
  return <Typography variant="h6">{title}</Typography>;
};

const Topbar: React.FC<TopbarProps> = ({ leftNavItems, rightNavItems }) => {
  return (
    <AppBar
      position="static"
      sx={theme => ({
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.common.black,
      })}
    >
      <Toolbar>
        <Box>{leftNavItems}</Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {rightNavItems}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
