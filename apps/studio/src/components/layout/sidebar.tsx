'use client';

import { Box, Drawer, Toolbar } from '@mui/material';
import { Button } from '@palico-ai/components';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { Link } from '@palico-ai/components';

const drawerWidth = 240;

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
      anchor='left'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <SidebarItem label="Playground" path="/playground" />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
