import { Box, IconButton, Paper, TextField } from '@mui/material';
import React from 'react';
import { MenuButton } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useTestCase } from '../hooks';
import LabItemViewConfig from '../constants';
import TestCaseCellContent from './content';

interface TestCaseCellParams {
  testCaseId: string;
}

const TestCaseCell: React.FC<TestCaseCellParams> = ({ testCaseId }) => {
  const {
    testCase,
    handleChangeTestCaseLabel,
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
        minWidth: LabItemViewConfig.TEST_PREVIEW_WIDTH,
        maxWidth: LabItemViewConfig.TEST_PREVIEW_WIDTH,
        height: 'inherit',
      }}
    >
      <Paper
        sx={{
          p: 1,
          boxSizing: 'border-box',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mb: 1,
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
        <TestCaseCellContent testCaseId={testCaseId} />
      </Paper>
    </th>
  );
};

export default TestCaseCell;
