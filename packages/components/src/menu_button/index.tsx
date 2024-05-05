'use client'

import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useRef } from 'react';

interface MenuItemProps {
  label: string;
  onClick: () => Promise<void> | void;
}

export interface MenuButtonProps {
  icon?: React.ReactNode;
  menuItems: MenuItemProps[];
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon, menuItems }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <IconButton
        onClick={() => {
          setOpen(!open);
        }}
        ref={anchorRef}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={item.onClick}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
