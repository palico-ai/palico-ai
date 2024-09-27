'use client';

import { Box, CardContent, CardHeader } from '@mui/material';
import { Card, FormBuilder, Typography } from '@palico-ai/components';
import { login } from '../../../services/auth';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../utils/route_path';

const StudioLoginPage: React.FC = () => {
  const router = useRouter();

  const handleSubmitLogin = async (values: Record<string, string>) => {
    const { username, password } = values;
    await login(username, password);
    router.push(RoutePath.chat());
  };

  return (
    <Box
      sx={(theme) => ({
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: theme.palette.background.default,
      })}
    >
      <Card
        sx={{
          padding: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Palico Studio Login
            </Typography>
          }
        />
        <CardContent>
          <FormBuilder
            formFields={[
              {
                type: 'text',
                name: 'username',
                label: 'Username',
                required: true,
              },
              {
                type: 'password',
                name: 'password',
                label: 'Password',
                required: true,
              },
            ]}
            onSubmit={handleSubmitLogin}
            submitButtonText="Login"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudioLoginPage;
