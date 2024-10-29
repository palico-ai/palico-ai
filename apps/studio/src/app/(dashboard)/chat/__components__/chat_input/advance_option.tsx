import { EditorProps } from '@monaco-editor/react';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { Editor, Typography } from '@palico-ai/components';
import React from 'react';

export interface AdvanceOptionProps {
  requestPayload?: string;
  onChangeRequestPayload: (payload?: string) => void;
  appConfig?: string;
  onChangeAppConfig: (appConfig?: string) => void;
}

const EDITOR_HEIGHT = '15vh';

const CodeInputPanel: React.FC<{
  label: string;
  value?: string;
  onChange: EditorProps['onChange'];
}> = ({ label, value, onChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6">{label}</Typography>
      <Editor
        height={EDITOR_HEIGHT}
        value={value}
        onChange={onChange}
        defaultLanguage="json"
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
              value={requestPayload}
              label="Request Payload"
              onChange={(value) => onChangeRequestPayload(value ?? '')}
            />
          </Grid>
          <Grid item md={6}>
            <CodeInputPanel
              value={appConfig}
              label="App Config"
              onChange={(value) => onChangeAppConfig(value ?? '')}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdvanceOption;
