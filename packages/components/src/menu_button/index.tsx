'use client';

import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useRef } from 'react';

interface MenuItemProps {
  label: string;
  onClick: () => Promise<void> | void;
}

export interface MenuButtonProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  menuItems: MenuItemProps[];
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  menuItems,
  children,
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Box
        ref={anchorRef}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {icon ? <IconButton>{icon}</IconButton> : children}
      </Box>
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={async () => {
              await item.onClick();
              setOpen(false);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
