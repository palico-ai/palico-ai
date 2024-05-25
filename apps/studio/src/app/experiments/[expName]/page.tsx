import { Box } from '@mui/material';
import PageContent from '../../../components/layout/page_content';
import {
  getExperimentByName,
  getTestsForExperiments,
} from '../../../services/experiments';
import { ExperimentItemChildPage } from '../../../types/component_types';
import React from 'react';
import TestList from './test_list';

const ExperimentItemPage: React.FC<ExperimentItemChildPage> = async (props) => {
  const currentExp = await getExperimentByName(props.params.expName);
  const tests = await getTestsForExperiments(props.params.expName);
  const sortedTests = tests.sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });
  console.log(tests);
  return (
    <PageContent title={`Experiment - ${currentExp.name}`}>
      <Box sx={{ m: 4 }}>
        <TestList initialTests={sortedTests} />
      </Box>
    </PageContent>
  );
};

export default ExperimentItemPage;
