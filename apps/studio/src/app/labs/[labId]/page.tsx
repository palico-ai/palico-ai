import React from 'react';
import { LabItemChildPage } from '../../../types/component_types';
import { LabContextProvider } from './__components__/lab.context';
import { getLabView } from '../../../services/studio';
import { getPalicoClient } from '../../../services/palico';
import PageContent from '../../../components/layout/page_content';
import QuicklabTopbarNav from './__components__/topbar_menu';
import AgentFeatureTestGrid from './__components__/grid';

export const dynamic = 'force-dynamic'

const LabItemPage: React.FC<LabItemChildPage> = async ({
  params: { labId },
}) => {
  const client = await getPalicoClient();
  const labData = await getLabView(labId);
  const agentMetadata = await client.metadata.getAgentsMetadata();

  console.log("labData", labData.testCases);

  return (
    <LabContextProvider
      agentIdList={agentMetadata.map((agent) => agent.id)}
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
