import { Box, Breadcrumbs } from '@mui/material';
import React from 'react';
import Topbar, { TopbarNavItem, TopbarProps } from './topbar';
import { Typography, Link } from '@palico-ai/components';
import TopbarSidebarMenu from './sidebar_menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContent {
  children: React.ReactNode;
  actions?: TopbarProps['actions'];
  navItems?: TopbarNavItem[];
  breadcrumb?: BreadcrumbItem[];
  removeTopbar?: boolean;
  disablePadding?: boolean;
}

const BreadcrumbUI: React.FC<{ breadcrumb: BreadcrumbItem[] }> = ({
  breadcrumb,
}) => {
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      {breadcrumb.map((item, index) => {
        const text = (
          <Typography key={index}>{decodeURI(item.label)}</Typography>
        );
        if (item.href) {
          return (
            <Link key={index} href={item.href}>
              {text}
            </Link>
          );
        }
        return text;
      })}
    </Breadcrumbs>
  );
};

const PageContent = ({
  children,
  breadcrumb,
  navItems,
  actions,
  removeTopbar,
  disablePadding,
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
          actions={actions}
          navItems={navItems}
          left={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TopbarSidebarMenu />
              {breadcrumb && <BreadcrumbUI breadcrumb={breadcrumb} />}
            </Box>
          }
        />
      )}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          width: '100%',
          padding: disablePadding ? 0 : 3,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContent;
