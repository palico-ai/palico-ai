import { ExperimentItemChildPage } from '../../../../types/component_types';
import { RoutePath } from '../../../../utils/route_path';
import { redirect } from 'next/navigation';
import React from 'react';

const ExperimentPage: React.FC<ExperimentItemChildPage> = ({
  params: { expName },
}) => {
  return redirect(
    RoutePath.experimentEvalList({
      experimentName: expName,
    })
  );
};

export default ExperimentPage;
