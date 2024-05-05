import { Editor } from '@monaco-editor/react';
import { Box, IconButton, Paper, TextField } from '@mui/material';
import React from 'react';
import { MenuButton, TabPanel, TabView } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useTestCase } from './hooks';

interface TestCaseCellParams {
  testCaseId: string;
}

const WIDTH = '375px';
const HEIGHT = '175px';

const TestCaseCell: React.FC<TestCaseCellParams> = ({ testCaseId }) => {
  const {
    testCase,
    handleChangeTestCaseContext,
    handleChangeTestCaseLabel,
    handleChangeTestCaseUserMessage,
    handleRemoveTestCase,
    runTests,
  } = useTestCase(testCaseId);
  if (!testCase) {
    throw new Error('Test Case not found');
  }
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
            value={testCase.label}
            onChange={(e) => handleChangeTestCaseLabel(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton size="small" color="success" onClick={runTests}>
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
                  handleRemoveTestCase();
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
              value={testCase.userMessage}
              onChange={(e) => handleChangeTestCaseUserMessage(e.target.value)}
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
              value={testCase.contextJSON}
              onChange={(value) => handleChangeTestCaseContext(value)}
              options={{
                ariaLabel: 'User Message',
                scrollBeyondLastColumn: 0,
              }}
            />
          </TabPanel>
        </TabView>
      </Paper>
    </th>
  );
};

export default TestCaseCell;
