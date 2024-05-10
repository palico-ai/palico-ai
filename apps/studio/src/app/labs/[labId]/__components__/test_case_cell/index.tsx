import { Box, IconButton, Paper, TextField } from '@mui/material';
import React from 'react';
import { MenuButton } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useTestCase } from '../hooks';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import EditTestCaseCell from './edit_cell';
import LabItemViewConfig from '../constants';
import TestCellPreview from './preview';

interface TestCaseCellParams {
  testCaseId: string;
}

const TestCaseCell: React.FC<TestCaseCellParams> = ({ testCaseId }) => {
  const [detailedView, setDetailedView] = React.useState(false);
  const {
    testCase,
    handleChangeTestCaseLabel,
    handleRemoveTestCase,
    runTests,
  } = useTestCase(testCaseId);
  if (!testCase) {
    throw new Error('Test Case not found');
  }

  const handleClickShowDetails = () => {
    setDetailedView(!detailedView);
  };

  return (
    <th
      scope="row"
      style={{
        minWidth: LabItemViewConfig.TEST_PREVIEW_WIDTH,
        maxWidth: LabItemViewConfig.TEST_PREVIEW_WIDTH,
        height: 'inherit',
      }}
    >
      <EditTestCaseCell
        isOpen={detailedView}
        onClose={handleClickShowDetails}
        testCaseId={testCaseId}
      />
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
          <IconButton onClick={handleClickShowDetails} sx={{ ml: 1 }}>
            <FullscreenIcon />
          </IconButton>
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
        <TestCellPreview {...testCase} />
      </Paper>
    </th>
  );
};

export default TestCaseCell;
