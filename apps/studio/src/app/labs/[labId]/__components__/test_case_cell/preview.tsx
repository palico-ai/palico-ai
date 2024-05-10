import { Box } from '@mui/material';
import { LabTestCaseModel } from '@palico-ai/common';
import { Typography, Chip } from '@palico-ai/components';
import React from 'react';
import LabItemViewConfig from '../constants';

const TestCellPreview: React.FC<LabTestCaseModel> = ({
  userMessage,
  metrics,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 1,
        p: 1,
        alignItems: 'flex-start',
      }}
    >
      <Typography variant="body2" textAlign={'left'} whiteSpace={"pre-line"}>
        {userMessage.substring(
          0,
          LabItemViewConfig.TEST_PREVIEW_MESSAGE_MAX_LENGTH
        ) +
          (userMessage.length >
          LabItemViewConfig.TEST_PREVIEW_MESSAGE_MAX_LENGTH
            ? '...'
            : '')}
      </Typography>
      <Box sx={{flexGrow: 1}} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {metrics?.map((metric, index) => (
          <Chip variant="outlined" key={index} label={metric} />
        ))}
      </Box>
    </Box>
  );
};

export default TestCellPreview;
