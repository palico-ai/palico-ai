'use client';

import { Box, Button, InputAdornment, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import ExpandIcon from '@mui/icons-material/Expand';
import AdvanceOption from './advance_option';
import { ChatSendMessageParams } from '@palico-ai/react';
import { useHotkeys } from 'react-hotkeys-hook';

export interface ChatInputProps {
  onSend: (params: ChatSendMessageParams) => Promise<void>;
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
  const [requestPayloadString, setRequestPayloadString] =
    React.useState<string>();
  const [appConfigString, setAppConfigString] = React.useState<string>();
  
  useHotkeys("ctrl+enter", () => {
    handleSubmit();
  }, {
    enableOnContentEditable: true,
    enabled: true,
    enableOnFormTags: true,
  });

  useHotkeys("ctrl + 3", () => {
    inputRef.current?.focus();
  }, {
    enableOnContentEditable: true,
    enabled: true,
    enableOnFormTags: true,
  })

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      await onSend({
        userMessage: message,
        payload: requestPayloadString?.length
          ? JSON.parse(requestPayloadString ?? '{}')
          : undefined,
        appConfig: JSON.parse(appConfigString ?? '{}'),
      });
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
    <Box>
      <AdvanceOption
        requestPayload={requestPayloadString}
        onChangeRequestPayload={setRequestPayloadString}
        appConfig={appConfigString}
        onChangeAppConfig={setAppConfigString}
      />
      <TextField
        multiline
        maxRows={10}
        sx={{ mt: 1 }}
        label="Message [Ctrl + 3]"
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
                size="small"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={!enableInput}
              >
                Send [Ctrl + Enter]
              </Button>
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
      />
    </Box>
  );
};