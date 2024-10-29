import React from 'react';
import { LabItemChildPage } from '../../../../types/component_types';
import AgentFeatureTestGrid from './__components__/grid';
import { LabApplicationProvider } from './__components__/app.context';

const LabItemPage: React.FC<LabItemChildPage> = async ({
  params: { labId },
}) => {
  return (
    <LabApplicationProvider labId={decodeURI(labId)}>
      <AgentFeatureTestGrid />
    </LabApplicationProvider>
  );
};

export default LabItemPage;
