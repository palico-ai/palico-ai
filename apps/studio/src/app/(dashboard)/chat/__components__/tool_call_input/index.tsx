import { Box, Grid } from '@mui/material';
import { JSONAbleObject } from '@palico-ai/common';
import { Button, Editor, Typography } from '@palico-ai/components';
import { editor } from 'monaco-editor';
import { ToolCall, useChat } from '@palico-ai/react';
import React, { useEffect, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-toastify';

export interface ToolCallPanelContentProps {
  toolCall: ToolCall;
  isActive?: boolean;
  onSubmit: (result?: JSONAbleObject) => void;
}

const ToolCallPanelContent: React.FC<ToolCallPanelContentProps> = ({
  toolCall,
  onSubmit,
}) => {
  const [result, setResult] = React.useState<string>();
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();

  useHotkeys(
    'ctrl + 1',
    () => {
      editor?.focus();
    },
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'ctrl+enter',
    () => {
      handleSubmit();
    },
    {
      enableOnContentEditable: true,
      enabled: true,
      enableOnFormTags: true,
    }
  );

  useEffect(() => {
    setResult('');
  }, [toolCall]);

  const handleSubmit = () => {
    try {
      if (!result) {
        onSubmit();
        return;
      }
      const resultJSON = JSON.parse(result ?? '');
      onSubmit(resultJSON);
    } catch (error) {
      toast.error('Invalid JSON');
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" gutterBottom>
            Result [Ctrl + 1]
          </Typography>
          <Editor
            onMount={(e) => {
              e.focus();
              setEditor(e);
            }}
            language="json"
            options={{
              minimap: { enabled: false },
            }}
            value={result}
            onChange={(value) => {
              setResult(value);
            }}
            height={200}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" gutterBottom>
            Arguments
          </Typography>
          <Editor
            language="json"
            height={200}
            options={{ readOnly: true, minimap: { enabled: false } }}
            value={JSON.stringify(toolCall.parameters ?? '{}', null, 2)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            fullWidth
          >
            Submit [Ctrl + Enter]
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export interface ToolCallInputProps {
  pendingToolCalls: ToolCall[];
  addResult: ReturnType<typeof useChat>['addResult'];
}

const ToolCallInput: React.FC<ToolCallInputProps> = ({
  pendingToolCalls,
  addResult,
}) => {
  const currentStepTool = useMemo(
    () => pendingToolCalls[0],
    [pendingToolCalls]
  );

  if (!pendingToolCalls.length) {
    return null;
  }

  return (
    <Box
      sx={(theme) => {
        return {
          padding: theme.spacing(2),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          marginBottom: theme.spacing(2),
        };
      }}
    >
      <Typography variant="subtitle1" fontSize={16} fontWeight={'bold'} mb={2}>
        Tool Call: {currentStepTool.name} + (...)
      </Typography>
      <ToolCallPanelContent
        toolCall={currentStepTool}
        onSubmit={(result) => {
          addResult(currentStepTool, result ?? {});
        }}
      />
    </Box>
  );
};

export default ToolCallInput;
