'use client';

import { Box, Divider, Drawer, Typography } from '@mui/material';
import { Button } from '@palico-ai/components';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { Link } from '@palico-ai/components';

const drawerWidth = 240;

interface SidebarNavItemParams {
  label: string;
  path: string;
}

const SIDEBAR_ITEMS: SidebarNavItemParams[] = [
  {
    label: 'Chat',
    path: '/playground',
  },
  {
    label: 'Comparator',
    path: '/compare',
  },
  {
    label: "Tracing",
    path: "/tracing",
  },
  {
    label: "Evaluations",
    path: "/evaluation",
  },
  {
    label: "Settings",
    path: "/settings",
  }
];

interface SidebarItemProps {
  label: string;
  path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label: text, path }) => {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return pathname.startsWith(path);
  }, [pathname, path]);

  return (
    <Link
      href={path}
      style={{
        marginLeft: 0,
        marginRight: 0,
        color: 'gray',
      }}
    >
      <Button
        fullWidth
        sx={{
          mb: 1,
        }}
        variant={isActive ? 'contained' : 'text'}
        color={isActive ? 'primary' : 'inherit'}
      >
        {text}
      </Button>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Typography
        variant="h5"
        textAlign={'center'}
        sx={{
          my: 3,
        }}
      >
        Palico Studio
      </Typography>
      <Divider sx={{
        mb: 2,
      }} />
      <Box sx={{ overflow: 'auto' }}>
        {SIDEBAR_ITEMS.map((item, key) => (
          <SidebarItem key={key} label={item.label} path={item.path} />
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
