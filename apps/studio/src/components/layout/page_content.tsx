import { Box, Breadcrumbs } from '@mui/material';
import React, { useMemo } from 'react';
import Topbar from './topbar';
import { Typography, Link } from '@palico-ai/components';
import TopbarSidebarMenu from './sidebar_menu';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContent {
  children: React.ReactNode;
  topbarRightNavs?: React.ReactNode;
  title?: string;
  breadcrumb?: BreadcrumbItem[];
  removeTopbar?: boolean;
}

const PageContent = ({
  children,
  title,
  breadcrumb,
  topbarRightNavs,
  removeTopbar,
}: PageContent) => {
  const breadcrumbUI = useMemo(() => {
    return breadcrumb?.map((item, index) => {
      const text = <Typography key={index}>{item.label}</Typography>;
      if (item.href) {
        return (
          <Link key={index} href={item.href}>
            {text}
          </Link>
        );
      }
      return text;
    });
  }, [breadcrumb]);

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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TopbarSidebarMenu />
              {title && (
                <Box>
                  <Typography variant="h6">{title}</Typography>
                </Box>
              )}
              {breadcrumbUI && (
                <Breadcrumbs aria-label="breadcrumb">
                  {breadcrumbUI}
                </Breadcrumbs>
              )}
            </Box>
          }
        />
      )}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          width: '100%',
          p: 3,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContent;
