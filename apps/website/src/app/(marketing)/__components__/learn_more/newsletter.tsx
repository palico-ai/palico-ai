import { Box, TextField } from '@mui/material';
import { Button, Form, Typography } from '@palico-ai/components';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { subscribeToBlog } from '../../../../services/ghost';

const SignupForNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const {
    mutate: subscribe,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (email?: string) => {
      if (!email) throw new Error('Email is required');
      await subscribeToBlog(email);
    },
  });

  return (
    <Form
      onSubmit={() => {
        subscribe(email);
      }}
    >
      {error && (
        <Typography gutterBottom color={'error'}>
          {error.message}
        </Typography>
      )}
      {isSuccess && (
        <Typography gutterBottom color={'success'}>
          {`Thank you for subscribing!`}
        </Typography>
      )}
      <TextField
        variant="outlined"
        type="email"
        disabled={isPending || isSuccess}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <Box>
              <Button
                disabled={isPending || isSuccess}
                loading={isPending}
                type="submit"
                variant="contained"
                color="secondary"
              >
                Subscribe
              </Button>
            </Box>
          ),
        }}
        fullWidth
      />
    </Form>
  );
};

export default SignupForNewsletter;
