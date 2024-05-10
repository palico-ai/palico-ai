import React from 'react';
import PageContent from '../../components/layout/page_content';
import AgentFeatureTestGrid from './__components__/grid';
import { LabContextProvider } from './__components__/lab.context';
import QuicklabTopbarNav from './__components__/topbar_menu';
import { getPalicoClient } from '../../services/palico';
import { StudioLabModel } from '@palico-ai/common';
import { getAllLabViews, getLabView } from '../../services/studio';

// const initialExperiments: LabExperimentModel[] = [
//   {
//     id: '1',
//     agentId: 'v1',
//     label: 'Experiment 1',
//     featureFlagJSON: JSON.stringify({}),
//   },
//   {
//     id: '2',
//     agentId: 'v2',
//     label: 'Experiment 2',
//     featureFlagJSON: JSON.stringify({}),
//   },
//   {
//     id: '3',
//     agentId: 'v2',
//     label: 'Experiment 3',
//     featureFlagJSON: JSON.stringify({}),
//   },
// ];

// const initialTestCases: LabTestCaseModel[] = [
//   {
//     id: '1',
//     label: 'Test Case 1',
//     userMessage: 'Test Case 1',
//     contextJSON: JSON.stringify({}),
//   },
//   {
//     id: '2',
//     label: 'Test Case 2',
//     userMessage: 'Test Case 2',
//     contextJSON: JSON.stringify({}),
//   },
//   {
//     id: '3',
//     label: 'Test Case 3',
//     userMessage: 'Test Case 3',
//     contextJSON: JSON.stringify({}),
//   },
// ];

const ComparatorPage: React.FC = async () => {
  const client = await getPalicoClient();
  const agentMetadata = await client.metadata.getAgentsMetadata();

  const labList = await getAllLabViews();
  const starterLab = labList[0];
  let starterLabView: StudioLabModel | undefined;
  if (starterLab) {
    starterLabView = await getLabView(starterLab.id);
    console.log(starterLabView)
  }

  return (
    <LabContextProvider
      agentIdList={agentMetadata.map((agent) => agent.id)}
      initialExperiments={starterLabView?.experiments ?? []}
      initialTestCases={starterLabView?.testCases ?? []}
      initialExperimentTestResults={starterLabView?.experimentTestResults ?? {}}
    >
      <PageContent
        topbarRightNavs={
          <QuicklabTopbarNav
            initialLabViews={labList}
            initialActiveViewId={starterLab.id}
          />
        }
      >
        <AgentFeatureTestGrid />
      </PageContent>
    </LabContextProvider>
  );
};

export default ComparatorPage;
