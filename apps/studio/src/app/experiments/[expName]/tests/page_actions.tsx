import { Box } from '@mui/material';
import {
  Button,
  FormField,
  SimpleDialogForm,
  useDialogController,
} from '@palico-ai/components';
import {
  getAllAgents,
  getAllTestCaseDatasets,
  getAllWorkflows,
} from '../../../../services/metadata';
import React, { useMemo } from 'react';
import { CreateExperimentTestJobResponse } from '@palico-ai/common';
import { runExperimentTest } from '../../../../services/experiments';
import { useExperimentName } from '../../../../hooks/use_params';

export interface TestListTableHeaderProps {
  onTestCreated: (test: CreateExperimentTestJobResponse) => void;
}

const TestListTableHeader: React.FC<TestListTableHeaderProps> = ({
  onTestCreated,
}) => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const [agentList, setAgentList] = React.useState<string[]>([]);
  const [workflowList, setWorkflowList] = React.useState<string[]>([]);
  const [datasetList, setDatasetList] = React.useState<string[]>([]);
  const experimentName = useExperimentName();

  React.useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const [agents, workflows, datasets] = await Promise.all([
        getAllAgents(),
        getAllWorkflows(),
        getAllTestCaseDatasets(),
      ]);
      console.log(datasets);
      setAgentList(agents.map((agent) => agent.name));
      setWorkflowList(workflows.map((workflow) => workflow.name));
      setDatasetList(datasets.map((dataset) => dataset.name));
    };

    fetchInitialData();
  }, []);

  const createTestFormFields: FormField[] = useMemo(() => {
    const fields: FormField[] = [
      {
        name: 'name',
        label: 'Name',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
      },
      {
        name: 'executor',
        label: 'Agent/Workflow',
        type: 'select',
        selectOptions: [
          ...agentList.map((agent) => ({
            label: `Agent - ${agent}`,
            value: `agent:${agent}`,
          })),
          ...workflowList.map((workflow) => ({
            label: `Workflow - ${workflow}`,
            value: `workflow:${workflow}`,
          })),
        ],
        required: true,
      },
      {
        name: 'testCaseDatasetName',
        label: 'Test Suite',
        type: 'select',
        selectOptions: datasetList.map((dataset) => ({
          label: dataset,
          value: dataset,
        })),
        required: true,
      },
      {
        name: 'featureFlags',
        label: 'Feature Flags',
        initialValue: '{}',
        type: 'code',
        required: true,
      },
    ];

    return fields;
  }, [agentList, datasetList, workflowList]);

  const handleCreateTest = async (
    data: Record<string, unknown>
  ): Promise<void> => {
    const response = await runExperimentTest({
      experimentName,
      testName: data.name as string,
      description: data.description as string,
      featureFlags: JSON.parse(data.featureFlags as string),
      testCaseDatasetName: data.testCaseDatasetName as string,
      ...((data.executor as string).startsWith('agent')
        ? { agentName: (data.executor as string).split(':')[1] }
        : { workflowName: (data.executor as string).split(':')[1] }),
    });
    console.log(response);
    onTestCreated(response);
  };

  return (
    <Box>
      <SimpleDialogForm
        title="Create New Test"
        isOpen={isOpen}
        closeForm={closeDialog}
        formFields={createTestFormFields}
        onSubmit={handleCreateTest}
      />
      <Button variant="contained" onClick={openDialog}>
        New Test
      </Button>
    </Box>
  );
};

export default TestListTableHeader;
