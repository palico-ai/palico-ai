import {
  Button,
  CheckboxAutocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TabPanel,
  TabView,
  TextField,
} from '@palico-ai/components';
import React from 'react';
import { useTestCase } from '../hooks';
import { Editor } from '@monaco-editor/react';
import { Box } from '@mui/material';

interface EditTestCaseCellProps {
  isOpen: boolean;
  onClose: () => void;
  testCaseId: string;
}

const HEIGHT = '250px';

const EditTestCaseCell: React.FC<EditTestCaseCellProps> = ({
  isOpen,
  onClose,
  testCaseId,
}) => {
  const {
    testCase,
    handleChangeTestCaseContext,
    handleChangeTestCaseUserMessage,
    handleChangeMetrics,
  } = useTestCase(testCaseId);

  if (!testCase) {
    throw new Error('Test Case not found');
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{testCase?.label}</DialogTitle>
      <DialogContent>
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
            {
              label: 'Metrics',
              value: 'metrics',
            },
          ]}
        >
          <TabPanel value="user_message">
            <TextField
              sx={{
                overflowY: 'auto',
                height: HEIGHT,
              }}
              fullWidth
              value={testCase.userMessage}
              onChange={(e) => handleChangeTestCaseUserMessage(e.target.value)}
              multiline
              variant="outlined"
              minRows={8}
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
          <TabPanel value="metrics">
            <Box sx={{ height: HEIGHT }}>
              <CheckboxAutocomplete
                options={[
                  {label: "Exact Match", value: "exact_match"},
                  {label: "JSON Schema Match", value: "json_schema"},
                  {label: "Professionalism", value: "professionalism"},
                  {label: "Friendly", value: "friendly"},
                  { label: "Toxicity", value: "toxicity"},
                  { label: "Bias", value: "bias"},
                  { label: "Ari Grade Level", value: "ari_grade_level"},
                  { label: "Flesch Kincaid Grade Level", value: "flesch_kincaid_grade_level"},
                  { label: "Rogue", value: "rogue"},
                ]}
                value={testCase.metrics ?? []}
                onChange={handleChangeMetrics}
                inputProps={{
                  fullWidth: true,
                  variant: 'standard',
                }}
              />
            </Box>
          </TabPanel>
        </TabView>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTestCaseCell;
