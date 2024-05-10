import { Box } from '@mui/material';
import React from 'react';
import Topbar from './topbar';
import { Typography } from '@palico-ai/components';

interface PageContent {
  children: React.ReactNode;
  topbarRightNavs?: React.ReactNode;
  title?: string;
  removeTopbar?: boolean;
}

const PageContent = ({
  children,
  title,
  topbarRightNavs,
  removeTopbar,
}: PageContent) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {!removeTopbar && (
        <Topbar
          rightNavItems={topbarRightNavs}
          leftNavItems={
            title && (
              <Box>
                <Typography variant="h6">{title}</Typography>
              </Box>
            )
          }
        />
      )}
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
