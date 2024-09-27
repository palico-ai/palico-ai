import React from 'react';
import { LabItemChildPage } from '../../../../types/component_types';
import { LabContextProvider } from './__components__/lab.context';
import { getLabView } from '../../../../services/studio';
import PageContent from '../../../../components/layout/page_content';
import QuicklabTopbarNav from './__components__/topbar_menu';
import AgentFeatureTestGrid from './__components__/grid';
import { getAllAgents } from '../../../../services/metadata';
import Breadcrumb from '../../../../utils/breadcrumb';

export const dynamic = 'force-dynamic';

const LabItemPage: React.FC<LabItemChildPage> = async ({
  params: { labId },
}) => {
  const labData = await getLabView(labId);
  const agentMetadata = await getAllAgents();
  return (
    <LabContextProvider
      agentIdList={agentMetadata.map((agent) => agent.name)}
      initialExperiments={labData.experiments ?? []}
      initialTestCases={labData.testCases ?? []}
      initialExperimentTestResults={labData.experimentTestResults ?? {}}
      initialBaselinedExperimentId={labData.baselineExperimentId}
    >
      <PageContent
        breadcrumb={[
          Breadcrumb.quickLab({ includeHref: true }),
          Breadcrumb.quickLabItem({ labName: labData.name }),
        ]}
        actions={<QuicklabTopbarNav currentLab={labData} />}
      >
        <AgentFeatureTestGrid />
      </PageContent>
    </LabContextProvider>
  );
};

export default LabItemPage;
