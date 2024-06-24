import { getEvalsForExperiments } from '../../../../services/experiments';
import { ExperimentItemChildPage } from '../../../../types/component_types';
import React from 'react';
import EvalList from './eval_list';

const ExperimentTestListPage: React.FC<ExperimentItemChildPage> = async (
  props
) => {
  const tests = await getEvalsForExperiments(props.params.expName);
  const sortedTests = tests.sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });
  return <EvalList initialTests={sortedTests} />;
};

export default ExperimentTestListPage;
