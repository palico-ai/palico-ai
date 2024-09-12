'use client';

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Button, Link } from '@palico-ai/components';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import RoutePath from '../../utils/route_path';

const NavItems = [
  {
    label: 'Docs',
    href: RoutePath.docs(),
  },
  {
    label: 'Github',
    target: '_blank',
    href: RoutePath.github(),
  },
  {
    label: 'Book a demo',
    href: RoutePath.scheduleDemo(),
    target: '_blank',
  },
  {
    label: 'Quickstart',
    href: RoutePath.quickStart(),
    highlight: true,
  },
];

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 240;

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          Palico AI
        </Typography>
        <Divider />
        <List>
          {NavItems.map((item, index) => (
            <Link key={index} href={item.href} target={item.target}>
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: 'center' }}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          // color: theme.palette.text.primary,
          // borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <Typography>Palico AI</Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
              gap: 1,
            }}
          >
            {NavItems.map((item, index) => (
              <Link key={index} href={item.href} target={item.target}>
                <Button
                  color={item.highlight ? 'primary' : 'inherit'}
                  variant={item.highlight ? 'contained' : 'text'}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={mobileOpen} onClose={handleDrawerToggle} />
    </>
  );
};

export default Navbar;
