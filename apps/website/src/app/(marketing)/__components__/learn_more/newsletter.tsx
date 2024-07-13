import { Box, TextField } from '@mui/material';
import { Button, Form, Typography } from '@palico-ai/components';
import React from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';

const url =
  'https://palico.us22.list-manage.com/subscribe/post?u=84ba2d0a4c03cc320b5fba0c1&amp;id=bd89db131c&amp;f_id=0020d2e1f0';

const SignupForNewsletter: React.FC = () => {
  const { loading, error, success, message, handleSubmit } =
    useMailChimpForm(url);
  const { fields, handleFieldChange } = useFormFields({
    EMAIL: '',
  });

  const onSubmit = () => {
    handleSubmit(fields);
  };

  return (
    <Form onSubmit={onSubmit}>
      {error && (
        <Typography gutterBottom color={'error'}>
          {message}
        </Typography>
      )}
      {success && (
        <Typography gutterBottom color={'success'}>
          {message}
        </Typography>
      )}
      <TextField
        variant="outlined"
        id="EMAIL"
        type="email"
        disabled={loading || success}
        value={fields.EMAIL}
        onChange={handleFieldChange}
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <Box>
              <Button
                disabled={loading || success}
                loading={loading}
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
