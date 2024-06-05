'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Button, Link } from '@palico-ai/components';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        // color: theme.palette.text.primary,
        // borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar>
        <Link href="/">
          <Typography>Palico AI</Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button variant="text" size="small" color="secondary">
            Docs
          </Button>
          <Button variant="text" size="small" color="secondary">
            Github
          </Button>
          <Button variant="text" size="small" color="secondary">
            Quickstart
          </Button>
          <Button variant="contained" size="small" color="info">
            Book a demo
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
