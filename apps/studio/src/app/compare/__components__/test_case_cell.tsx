import { Editor } from '@monaco-editor/react';
import { Box, IconButton, Paper, TextField } from '@mui/material';
import React from 'react';
import { MenuButton, TabPanel, TabView } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';

interface TestCaseCellParams {
  label: string;
}

const WIDTH = '400px';
const HEIGHT = '175px';

const TestCaseCell: React.FC<TestCaseCellParams> = ({ label }) => {
  return (
    <th
      scope="row"
      style={{
        minWidth: WIDTH,
        maxWidth: WIDTH,
      }}
    >
      <Paper
        sx={{
          p: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={label}
            InputProps={{
              endAdornment: (
                <IconButton size="small" color="success">
                  <RunIcon />
                </IconButton>
              ),
            }}
            placeholder="Test Case Name"
          />
          <MenuButton
            icon={<OptionMenuIcon />}
            menuItems={[
              {
                label: 'Delete',
                onClick: () => {
                  console.log('Delete');
                },
              },
            ]}
          />
        </Box>
        <TabView
          tabs={[
            {
              label: 'User Message',
              value: 'user_message',
            },
            {
              label: 'Context',
              value: 'context_json',
            },
          ]}
        >
          <TabPanel value="user_message">
            <TextField
              sx={{
                overflowY: 'auto',
                maxHeight: HEIGHT,
              }}
              fullWidth
              multiline
              variant="outlined"
              minRows={6}
              placeholder="Message...."
            />
          </TabPanel>
          <TabPanel value="context_json">
            <Editor
              theme="vs-dark"
              height={HEIGHT}
              defaultLanguage="json"
              options={{
                ariaLabel: 'User Message',
                scrollBeyondLastColumn: 0,
              }}
              defaultValue={`{\n  "key": "value"\n}`}
            />
          </TabPanel>
        </TabView>
      </Paper>
    </th>
  );
};

export default TestCaseCell;
