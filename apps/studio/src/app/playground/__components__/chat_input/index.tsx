'use client';

import { Box, Button, InputAdornment, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import ExpandIcon from '@mui/icons-material/Expand';
import AdvanceOption from './advance_option';

export interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  placeholder = 'Type a message',
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      setLoading(true);
      await onSend(message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };
  const enableInput = useMemo(() => !loading && !disabled, [loading, disabled]);

  useEffect(() => {
    if (inputRef.current) {
      console.log('Focusing input');
      inputRef.current?.focus();
    }
  }, [inputRef, enableInput]);

  return (
    <form onSubmit={handleFormSubmit}>
      <AdvanceOption />
      <TextField
        sx={{mt: 1}}
        label="User Message"
        fullWidth
        variant="outlined"
        autoComplete="off"
        disabled={!enableInput}
        placeholder={placeholder}
        inputRef={inputRef}
        type="text"
        value={message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title="Show/Hide Advance Options" placement="top-start">
                <Box
                  sx={{
                    cursor: 'pointer',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    px: 1,
                  }}
                >
                  <ExpandIcon />
                </Box>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button
                type="submit"
                size="small"
                color="primary"
                variant="contained"
                disabled={!enableInput}
              >
                Send
              </Button>
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
      />
    </form>
  );
};
