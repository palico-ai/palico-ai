'use client';

import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  List,
  ListItem,
  Drawer as MUIDrawer,
  Theme,
  ListItemButton,
  styled,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import OpenDrawerIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CloseDrawerIcon from '@mui/icons-material/ChevronLeft';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { Link } from '@palico-ai/components';
import ChatBubbleIcon from '@mui/icons-material/Textsms';
import ExperimentIcon from '@mui/icons-material/Science';
import TracerIcon from '@mui/icons-material/MonitorHeart';
import EvaluationIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';

interface SidebarNavItemParams {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarNavItemParams[] = [
  {
    label: 'Chat',
    path: '/playground',
    icon: <ChatBubbleIcon />,
  },
  {
    label: 'Labs',
    path: '/labs',
    icon: <ExperimentIcon />,
  },
  {
    label: 'Tracing',
    path: '/tracing',
    icon: <TracerIcon />,
  },
  {
    label: 'Evaluations',
    path: '/evaluation',
    icon: <EvaluationIcon />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MUIDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface SidebarListItemProps extends SidebarNavItemParams {
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarListItemProps> = ({
  label: text,
  path,
  isCollapsed,
  icon,
}) => {
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
      <ListItem key={text} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          selected={isActive}
          color="primary"
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: !isCollapsed ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: isCollapsed ? 0 : 1 }} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" anchor="left" open={open}>
      <DrawerHeader>
        {open ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                ml: 1,
              }}
            >
              <Image src="/logo.png" alt="Palico AI" width={32} height={32} />
              <Typography variant="h6" noWrap>
                Palico AI
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={handleDrawerClose}>
                <CloseDrawerIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Image src="/logo.png" alt="Palico AI" width={32} height={32} />
          </Box>
        )}
      </DrawerHeader>
      <Divider />
      <List>
        {SIDEBAR_ITEMS.map((item, key) => (
          <SidebarItem
            key={key}
            label={item.label}
            path={item.path}
            icon={item.icon}
            isCollapsed={!open}
          />
        ))}
      </List>
      {!open && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Divider />
          <IconButton
            onClick={handleDrawerOpen}
            sx={{
              borderRadius: 0,
            }}
          >
            <OpenDrawerIcon />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
