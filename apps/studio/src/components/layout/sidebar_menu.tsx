'use client';
import { IconButton } from '@palico-ai/components';
import React, { useContext } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { DashboardLayoutContext } from '../../context/dashboard_layout';

const TopbarSidebarMenu: React.FC = () => {
  const { toggleSidebar } = useContext(DashboardLayoutContext);
  return (
    <IconButton
      onClick={toggleSidebar}
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  );
};

export default TopbarSidebarMenu;