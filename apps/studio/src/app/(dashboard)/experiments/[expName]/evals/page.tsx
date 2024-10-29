import { ExperimentItemChildPage } from '../../../../../types/component_types';
import React from 'react';
import EvalList from './eval_list';

const ExperimentTestListPage: React.FC<ExperimentItemChildPage> = async (
  props
) => {
  return <EvalList expName={decodeURI(props.params.expName)} />;
};

export default ExperimentTestListPage;
