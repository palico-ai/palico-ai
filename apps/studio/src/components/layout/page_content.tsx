import { Box } from '@mui/material';
import React from 'react';
import Topbar from './topbar';

interface PageContent {
  children: React.ReactNode;
  topbarRightNavs?: React.ReactNode;
  removeTopbar?: boolean;
}

const PageContent = ({ children, topbarRightNavs, removeTopbar }: PageContent) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {!removeTopbar && <Topbar rightNavItems={topbarRightNavs} />}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContent;
