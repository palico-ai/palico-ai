import React from 'react';
import PageContent from '../../components/layout/page_content';
import AgentFeatureTestGrid from './__components__/grid';
import {
  ExperimentDataContextProvider,
  LabExperimentModel,
  LabTestCaseModel,
} from './__components__/data.context';
import QuicklabTopbarNav from './__components__/topbar_menu';
import { PalicoService } from '../../services/palico';

const initialExperiments: LabExperimentModel[] = [
  {
    id: '1',
    agentId: 'v1',
    label: 'Experiment 1',
    featureFlagJSON: JSON.stringify({}),
  },
  {
    id: '2',
    agentId: 'v2',
    label: 'Experiment 2',
    featureFlagJSON: JSON.stringify({}),
  },
  {
    id: '3',
    agentId: 'v2',
    label: 'Experiment 3',
    featureFlagJSON: JSON.stringify({}),
  },
];

const initialTestCases: LabTestCaseModel[] = [
  {
    id: '1',
    label: 'Test Case 1',
    userMessage: 'Test Case 1',
    contextJSON: JSON.stringify({}),
  },
  {
    id: '2',
    label: 'Test Case 2',
    userMessage: 'Test Case 2',
    contextJSON: JSON.stringify({}),
  },
  {
    id: '3',
    label: 'Test Case 3',
    userMessage: 'Test Case 3',
    contextJSON: JSON.stringify({}),
  },
];

const ComparatorPage: React.FC = async () => {
  const client = PalicoService.getClient();
  const agentMetadata = await client.metadata.getAgentsMetadata();

  return (
    <ExperimentDataContextProvider
      viewId="1"
      viewLabel="View 1"
      agentIdList={agentMetadata.map((agent) => agent.id)}
      initialExperiments={initialExperiments}
      initialTestCases={initialTestCases}
      initialExperimentTestResults={{}}
    >
      <PageContent topbarRightNavs={<QuicklabTopbarNav />}>
        <AgentFeatureTestGrid />
      </PageContent>
    </ExperimentDataContextProvider>
  );
};

export default ComparatorPage;
