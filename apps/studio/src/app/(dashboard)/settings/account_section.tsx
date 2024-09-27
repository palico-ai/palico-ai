'use client';
import { Box } from '@mui/material';
import { Button } from '@palico-ai/components';
import { RoutePath } from '../../../utils/route_path';
import { useRouter } from 'next/navigation';
import React from 'react';
import { logout } from '../../../services/auth';

const AccountSettings: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(RoutePath.login());
  };

  return (
    <Box>
      <Button variant="contained" color="warning" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default AccountSettings;
