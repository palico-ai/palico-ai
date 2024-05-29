import { Box } from '@mui/material';
import { ComponentWithChildren } from '@palico-ai/components';
import React from 'react';

const ExperimentTabPickerLayout: React.FC<ComponentWithChildren> = ({
  children,
}) => {
  return <Box>{children}</Box>;
};

export default ExperimentTabPickerLayout;
