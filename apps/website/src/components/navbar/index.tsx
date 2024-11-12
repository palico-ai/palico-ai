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
import AppRoute, { DocRoute } from '../../utils/route_path';
import Image from 'next/image';
import Logo from '../../../public/logos/palico.png';

const NavItems = [
  {
    label: 'Docs',
    href: DocRoute.docs(),
  },
  {
    label: 'Github',
    target: '_blank',
    href: AppRoute.github(),
  },
  {
    label: 'Blog',
    href: AppRoute.blog(),
    target: '_blank',
  },
  {
    label: 'Book a demo',
    href: AppRoute.scheduleDemo(),
    target: '_blank',
  },
  {
    label: 'Quickstart',
    href: DocRoute.quickStart(),
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
        color="transparent"
        sx={{
          backgroundColor: 'transparent',
          // boxShadow: 'none',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
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
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Image width={28} height={28} src={Logo} alt="Palico AI" />
              <Typography
                // variant="h6"
                fontWeight={700}
                fontSize={18}
                color={'primary.light'}
              >
                Palico AI
              </Typography>
            </Box>
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
                  size="small"
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
