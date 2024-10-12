import { Box } from '@mui/material';
import {
  Button,
  FormField,
  SimpleDialogForm,
  useDialogController,
} from '@palico-ai/components';
import {
  getAllAgents,
  getAllTestSuites,
} from '../../../../../services/metadata';
import React, { useMemo } from 'react';
import { CreateEvalJobResponse } from '@palico-ai/common';
import { runEval } from '../../../../../services/experiments';
import { useExperimentName } from '../../../../../hooks/use_params';

export interface TestListTableHeaderProps {
  onEvalCreated: (test: CreateEvalJobResponse) => void;
}

const TestListTableHeader: React.FC<TestListTableHeaderProps> = ({
  onEvalCreated: onTestCreated,
}) => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const [agentList, setAgentList] = React.useState<string[]>([]);
  const [datasetList, setDatasetList] = React.useState<string[]>([]);
  const experimentName = useExperimentName();

  React.useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const [agents, datasets] = await Promise.all([
        getAllAgents(),
        getAllTestSuites(),
      ]);
      console.log(datasets);
      setAgentList(agents.map((agent) => agent.name));
      setDatasetList(datasets.map((dataset) => dataset.name));
    };

    fetchInitialData();
  }, []);

  const createEvalFormFields: FormField[] = useMemo(() => {
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
        label: 'Agents',
        type: 'select',
        selectOptions: [
          ...agentList.map((agent) => ({
            label: `Agent - ${agent}`,
            value: `agent:${agent}`,
          })),
        ],
        required: true,
      },
      {
        name: 'testSuiteName',
        label: 'Test Suite',
        type: 'select',
        selectOptions: datasetList.map((dataset) => ({
          label: dataset,
          value: dataset,
        })),
        required: true,
      },
      {
        name: 'appConfig',
        label: 'App Config',
        initialValue: '{}',
        type: 'code',
        required: true,
      },
    ];

    return fields;
  }, [agentList, datasetList]);

  const handleCreateTest = async (
    data: Record<string, unknown>
  ): Promise<void> => {
    const response = await runEval({
      experimentName,
      evalName: data.name as string,
      description: data.description as string,
      appConfig: JSON.parse(data.appConfig as string),
      testSuiteName: data.testSuiteName as string,
      ...((data.executor as string).startsWith('agent')
        ? { agentName: (data.executor as string).split(':')[1] }
        : { workflowName: (data.executor as string).split(':')[1] }),
    });
    console.log(response);
    onTestCreated(response);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <SimpleDialogForm
        title="Create New Evaluation"
        isOpen={isOpen}
        closeForm={closeDialog}
        formFields={createEvalFormFields}
        onSubmit={handleCreateTest}
      />
      <Button variant="contained" size="small" onClick={openDialog}>
        Create Evaluation
      </Button>
    </Box>
  );
};

export default TestListTableHeader;
