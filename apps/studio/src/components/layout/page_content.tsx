import { Box } from '@mui/material';
import React from 'react'
import Topbar from './topbar';

interface PageContent {
  children: React.ReactNode;
  topbarRightNavs?: React.ReactNode;
}

const PageContent = ({ children }: PageContent) => {
  return (
    <Box
    sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}
  >
    <Topbar />
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  </Box>
  )
}

export default PageContent