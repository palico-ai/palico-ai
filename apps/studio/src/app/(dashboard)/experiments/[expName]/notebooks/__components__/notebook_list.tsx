'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { NotebookMetadata } from '@palico-ai/common';
import {
  Button,
  ErrorMessage,
  Link,
  PromptAcceptAction,
  Skeleton,
  Table,
  useDialogController,
  useTableModel,
} from '@palico-ai/components';
import { Box, Paper } from '@mui/material';
import { RoutePath } from '../../../../../../utils/route_path';
import {
  RequireExperimentName,
  RequireNoteobokName,
} from '../../../../../../types/common';
import {
  deleteNotebook,
  getNotebooksForExperiment,
} from '../../../../../../services/experiments';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_NOTEBOOKS_FOR_EXPERIMENT } from '../../../../../../constants/query_keys';

const ActionColumn: React.FC<RequireNoteobokName & RequireExperimentName> = ({
  experimentName,
  notebookName,
}) => {
  const {
    isOpen: isOpenDeleteDialog,
    open: openConfirmDialog,
    close: closeConfirmDialog,
  } = useDialogController();
  const queryClient = useQueryClient();
  const handleDeleteNotebook = async () => {
    await deleteNotebook({
      experimentName,
      notebookName,
    });
    await queryClient.invalidateQueries({
      queryKey: [GET_NOTEBOOKS_FOR_EXPERIMENT, experimentName],
    });
    openConfirmDialog();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <PromptAcceptAction
        title="Are you sure you want to delete this notebook?"
        message="This action cannot be undone."
        onAccept={handleDeleteNotebook}
        closePrompt={closeConfirmDialog}
        isOpen={isOpenDeleteDialog}
      />
      <Link
        href={RoutePath.experimentNotebookItem({
          experimentName,
          notebookName,
        })}
      >
        <Button color="success" variant="outlined" size="small">
          Open
        </Button>
      </Link>
      <Button
        color="error"
        variant="outlined"
        size="small"
        onClick={openConfirmDialog}
      >
        Delete
      </Button>
    </Box>
  );
};

const columns: ColumnDef<NotebookMetadata>[] = [
  {
    accessorKey: 'notebookName',
    header: 'Name',
  },
  {
    accessorKey: 'experimentName',
    header: 'Experiment',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <ActionColumn
          notebookName={row.original.notebookName}
          experimentName={row.original.experimentName}
        />
      );
    },
  },
];

export interface NotebookListProps {
  expName: string;
}

const NotebookList: React.FC<NotebookListProps> = ({ expName }) => {
  const {
    data: notebooks,
    isPending,
    error,
  } = useQuery({
    queryKey: [GET_NOTEBOOKS_FOR_EXPERIMENT, expName],
    queryFn: async () => {
      return await getNotebooksForExperiment(expName);
    },
  });

  const table = useTableModel({
    data: notebooks || [],
    columns,
  });

  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  if (isPending) {
    return <Skeleton count={5} height={120} />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Table table={table} />
    </Paper>
  );
};

export default NotebookList;
