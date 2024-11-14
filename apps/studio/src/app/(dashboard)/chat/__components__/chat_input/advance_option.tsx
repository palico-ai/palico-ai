import { EditorProps } from '@monaco-editor/react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { Editor, Typography } from '@palico-ai/components';
import React from 'react';
import { editor } from 'monaco-editor';
import { useHotkeys } from 'react-hotkeys-hook';

export interface AdvanceOptionProps {
  requestPayload?: string;
  onChangeRequestPayload: (payload?: string) => void;
  appConfig?: string;
  onChangeAppConfig: (appConfig?: string) => void;
}

const EDITOR_HEIGHT = '18vh';

const CodeInputPanel: React.FC<{
  label: string;
  value?: string;
  focusKey: string;
  onChange: EditorProps['onChange'];
}> = ({ label, focusKey, value, onChange }) => {
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();

  useHotkeys(
    focusKey,
    () => {
      editor?.focus();
    },
    {
      enableOnContentEditable: true,
      enableOnFormTags: true,
    }
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography fontWeight={'regular'} variant="overline" fontSize={14}>
        {label} [{focusKey}]{' '}
      </Typography>
      <Editor
        height={EDITOR_HEIGHT}
        value={value}
        onChange={onChange}
        defaultLanguage="json"
        onMount={(e) => {
          setEditor(e);
        }}
        options={{
          ariaLabel: 'User Message',
          scrollBeyondLastColumn: 0,
          minimap: { enabled: false },
        }}
      />
    </Box>
  );
};

const AdvanceOption: React.FC<AdvanceOptionProps> = ({
  requestPayload,
  onChangeRequestPayload,
  appConfig,
  onChangeAppConfig,
}) => {
  return (
    <Card>
      <CardContent>
        <Grid
          container
          spacing={2}
          sx={{
            boxSizing: 'border-box',
          }}
        >
          <Grid item md={6}>
            <CodeInputPanel
              focusKey="Ctrl + 1"
              value={requestPayload}
              label="Payload"
              onChange={(value) => onChangeRequestPayload(value ?? '')}
            />
          </Grid>
          <Grid item md={6}>
            <CodeInputPanel
              focusKey="Ctrl + 2"
              value={appConfig}
              label="App-Config"
              onChange={(value) => onChangeAppConfig(value ?? '')}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdvanceOption;
