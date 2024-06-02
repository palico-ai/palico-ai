import { getTestsForExperiments } from '../../../../services/experiments';
import { ExperimentItemChildPage } from '../../../../types/component_types';
import React from 'react';
import TestList from './test_list';

const ExperimentTestListPage: React.FC<ExperimentItemChildPage> = async (
  props
) => {
  const tests = await getTestsForExperiments(props.params.expName);
  const sortedTests = tests.sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });
  return <TestList initialTests={sortedTests} />;
};

export default ExperimentTestListPage;
