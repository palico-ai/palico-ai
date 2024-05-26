import React from 'react';
import { LabItemChildPage } from '../../../types/component_types';
import { LabContextProvider } from './__components__/lab.context';
import { getLabView } from '../../../services/studio';
import PageContent from '../../../components/layout/page_content';
import QuicklabTopbarNav from './__components__/topbar_menu';
import AgentFeatureTestGrid from './__components__/grid';
import { getAllAgents } from '../../../services/metadata';

export const dynamic = 'force-dynamic';

const LabItemPage: React.FC<LabItemChildPage> = async ({
  params: { labId },
}) => {
  const labData = await getLabView(labId);
  const agentMetadata = await getAllAgents();

  console.log('labData', labData.testCases);

  return (
    <LabContextProvider
      agentIdList={agentMetadata.map((agent) => agent.name)}
      initialExperiments={labData.experiments ?? []}
      initialTestCases={labData.testCases ?? []}
      initialExperimentTestResults={labData.experimentTestResults ?? {}}
    >
      <PageContent
        title={labData.name}
        topbarRightNavs={<QuicklabTopbarNav currentLab={labData} />}
      >
        <AgentFeatureTestGrid />
      </PageContent>
    </LabContextProvider>
  );
};

export default LabItemPage;
