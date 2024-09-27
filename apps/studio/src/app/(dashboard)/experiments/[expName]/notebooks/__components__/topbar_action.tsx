'use client';

import { Box, Button } from '@mui/material';
import {
  FormField,
  SimpleDialogForm,
  useDialogController,
} from '@palico-ai/components';
import { createNotebook } from '../../../../../../services/experiments';
import { useExperimentName } from '../../../../../../hooks/use_params';
import { useContext } from 'react';
import NotebookListContext from './notebook_list.context';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../../../../utils/route_path';

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
  const { notebooks, setNotebooks } = useContext(NotebookListContext);
  const router = useRouter();

  const handleCreateNotebook = async (values: Record<string, unknown>) => {
    const { name } = values;
    if (!name) {
      throw new Error('Notebook name is required');
    }
    const notebook = await createNotebook({
      experimentName,
      notebookName: name as string,
      rows: [],
      datasetMetadata: [],
    });
    console.log(notebook);
    setNotebooks([notebook, ...notebooks]);
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
