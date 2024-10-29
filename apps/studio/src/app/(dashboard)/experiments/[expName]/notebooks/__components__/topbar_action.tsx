'use client';

import { Box, Button } from '@mui/material';
import {
  FormField,
  SimpleDialogForm,
  useDialogController,
} from '@palico-ai/components';
import { createNotebook } from '../../../../../../services/experiments';
import { useExperimentName } from '../../../../../../hooks/use_params';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../../../../utils/route_path';
import { useQueryClient } from '@tanstack/react-query';
import { GET_NOTEBOOKS_FOR_EXPERIMENT } from '../../../../../../constants/query_keys';

const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Notebook Name',
    required: true,
  },
];

const NotebookListTopbarAction: React.FC = () => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const experimentName = useExperimentName();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreateNotebook = async (values: Record<string, unknown>) => {
    const { name } = values;
    if (!name) {
      throw new Error('Notebook name is required');
    }
    await createNotebook({
      experimentName,
      notebookName: name as string,
      rows: [],
      datasetMetadata: [],
    });
    await queryClient.invalidateQueries({
      queryKey: [GET_NOTEBOOKS_FOR_EXPERIMENT],
    });
    router.push(
      RoutePath.experimentNotebookItem({
        experimentName,
        notebookName: name as string,
      })
    );
    closeDialog();
  };

  return (
    <Box>
      <SimpleDialogForm
        title="Create New Notebook"
        isOpen={isOpen}
        closeForm={closeDialog}
        formFields={formFields}
        onSubmit={handleCreateNotebook}
      />
      <Button variant="contained" size="small" onClick={openDialog}>
        Create Notebook
      </Button>
    </Box>
  );
};

export default NotebookListTopbarAction;
