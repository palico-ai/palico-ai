'use client';
import { Editor, TabPanel, TabView, TextField } from '@palico-ai/components';
import React from 'react';
import { useTestCase } from '../hooks';
import LabItemViewConfig from '../constants';

interface TestCaseCellContentProps {
  testCaseId: string;
}

const TestCaseCellContent: React.FC<TestCaseCellContentProps> = ({
  testCaseId,
}) => {
  const {
    testCase,
    handleChangeRequestPayload,
    handleChangeTestCaseUserMessage,
  } = useTestCase(testCaseId);

  if (!testCase) {
    throw new Error('Test Case not found');
  }

  return (
    <TabView
      tabs={[
        {
          label: 'User Message',
          value: 'user_message',
        },
        {
          label: 'Payload',
          value: 'payload',
        },
      ]}
    >
      <TabPanel value="user_message">
        <TextField
          sx={{
            overflowY: 'auto',
            minHeight: LabItemViewConfig.TEST_PREVIEW_HEIGHT,
            maxHeight: LabItemViewConfig.TEST_PREVIEW_HEIGHT,
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
      <TabPanel value="payload">
        <Editor
          theme="vs-dark"
          height={LabItemViewConfig.TEST_PREVIEW_HEIGHT}
          defaultLanguage="json"
          value={testCase.payloadString ?? '{}'}
          onChange={(value) => handleChangeRequestPayload(value)}
          options={{
            ariaLabel: 'User Message',
            scrollBeyondLastColumn: 0,
          }}
        />
      </TabPanel>
    </TabView>
  );
};

export default TestCaseCellContent;
