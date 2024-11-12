'use client';

import { AppBar, Box, Divider, Toolbar } from '@mui/material';
import { Typography, Button, Link, ButtonProps } from '@palico-ai/components';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface TopbarActionItem {
  label: string;
  onClick: () => void;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TopbarProps {
  left?: React.ReactNode;
  actions?: TopbarActionItem[] | React.ReactNode;
  navItems?: TopbarNavItem[];
}

export interface TopbarNavItem {
  label: string;
  href: string;
}

export interface TopbarPageTitleProps {
  title: string;
}

export const TopbarPageTitle: React.FC<TopbarPageTitleProps> = ({ title }) => {
  return <Typography variant="h6">{title}</Typography>;
};

export const Navigation: React.FC<{ navItems: TopbarNavItem[] }> = ({
  navItems,
}) => {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      {navItems.map((navItem, index) => {
        const isActive = navItem.href === pathname;
        return (
          <Link key={index} href={navItem.href}>
            <Button disabled={isActive}>{navItem.label}</Button>
          </Link>
        );
      })}
    </Box>
  );
};

export const TopbarActions: React.FC<{ actions: TopbarActionItem[] }> = ({
  actions,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          color={action.color}
          variant={action.variant}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};

const Topbar: React.FC<TopbarProps> = ({
  left: leftNavItems,
  actions,
  navItems,
}) => {
  return (
    <Box>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          backgroundColor: 'transparent',
          // boxShadow: 'none',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <Toolbar>
          <Box>{leftNavItems}</Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {navItems && <Navigation navItems={navItems} />}
            {navItems && actions ? (
              <Divider orientation="vertical" flexItem />
            ) : (
              <></>
            )}
            {actions && actions instanceof Array ? (
              <TopbarActions actions={actions} />
            ) : (
              actions
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;
