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
  getAllWorkflows,
} from '../../../../../services/metadata';
import React, { useMemo } from 'react';
import { runEval } from '../../../../../services/experiments';
import { useQueryClient } from '@tanstack/react-query';
import { GET_EVALS_FOR_EXPERIMENT } from '../../../../../constants/query_keys';

export interface EvalListTableHeaderProps {
  experimentName: string;
}

const EvalListTableHeader: React.FC<EvalListTableHeaderProps> = ({
  experimentName,
}) => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const [agentList, setAgentList] = React.useState<string[]>([]);
  const [workflowList, setWorkflowList] = React.useState<string[]>([]);
  const [datasetList, setDatasetList] = React.useState<string[]>([]);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const [agents, workflows, datasets] = await Promise.all([
        getAllAgents(),
        getAllWorkflows(),
        getAllTestSuites(),
      ]);
      console.log(datasets);
      setAgentList(agents.map((agent) => agent.name));
      setWorkflowList(workflows.map((workflow) => workflow.name));
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
  }, [agentList, datasetList, workflowList]);

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
    await queryClient.invalidateQueries({
      queryKey: [GET_EVALS_FOR_EXPERIMENT, experimentName],
    });
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

export default EvalListTableHeader;
