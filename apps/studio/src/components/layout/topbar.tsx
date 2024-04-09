'use client';

import { AppBar, Toolbar, Typography } from '@mui/material'
import { Link } from '@palico-ai/components';
import React from 'react'

const Topbar = () => {
  return (
    <AppBar position="static" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
    <Toolbar>
      <Link href='/'>
      <Typography variant="h6" noWrap component="div">
        Palico Studio
      </Typography>
      </Link>
    </Toolbar>
  </AppBar>
  )
}

export default Topbar