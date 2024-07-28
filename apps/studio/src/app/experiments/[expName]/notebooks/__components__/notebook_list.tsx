'use client';

import React, { useContext } from 'react';
import NotebookListContext from './notebook_list.context';
import { ColumnDef } from '@tanstack/react-table';
import { NotebookMetadata } from '@palico-ai/common';
import {
  Button,
  Link,
  PromptAcceptAction,
  Table,
  useDialogController,
  useTableModel,
} from '@palico-ai/components';
import { Box, Paper } from '@mui/material';
import { RoutePath } from '../../../../../utils/route_path';
import {
  RequireExperimentName,
  RequireNoteobokName,
} from '../../../../../types/common';
import { deleteNotebook } from '../../../../../services/experiments';

const ActionColumn: React.FC<RequireNoteobokName & RequireExperimentName> = ({
  experimentName,
  notebookName,
}) => {
  const {
    isOpen: isOpenDeleteDialog,
    open: openConfirmDialog,
    close: closeConfirmDialog,
  } = useDialogController();
  const { setNotebooks, notebooks } = useContext(NotebookListContext);

  const handleDeleteNotebook = async () => {
    await deleteNotebook({
      experimentName,
      notebookName,
    });
    setNotebooks([...notebooks].filter((n) => n.notebookName !== notebookName));
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

const NotebookList: React.FC = () => {
  const { notebooks } = useContext(NotebookListContext);
  const table = useTableModel({
    data: notebooks,
    columns,
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Table table={table} />
    </Paper>
  );
};

export default NotebookList;
