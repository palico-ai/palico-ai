'use client';

import {
  Link,
  Card,
  CardContent,
  SimpleListView,
  Typography,
  FormField,
  useDialogController,
  Button,
  SimpleDialogForm,
  CardActions,
} from '@palico-ai/components';
import React from 'react';
import { RoutePath } from '../../../utils/route_path';
import { Box, Divider, Grid } from '@mui/material';
import { QuickLab, QuickLabMetadata } from '@palico-ai/common';
import { createLabView, deleteLabView } from '../../../services/studio';
import { useRouter } from 'next/navigation';

const CreateLabFormField: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
];

export interface LabListHeaderProps {
  onCreateLab: (item: QuickLab) => void;
}

const LabListHeader: React.FC<LabListHeaderProps> = ({ onCreateLab }) => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const handleCreateLab = async (
    data: Record<string, string>
  ): Promise<void> => {
    try {
      const item = await createLabView({
        name: data.name,
        experiments: [],
        testCases: [],
        experimentTestResults: {},
      });
      onCreateLab(item);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <Button onClick={openDialog} variant="contained" color="primary">
          Create Lab
        </Button>
      </Box>
      <SimpleDialogForm
        title="Create New Lab"
        formFields={CreateLabFormField}
        isOpen={isOpen}
        onSubmit={handleCreateLab}
        closeForm={closeDialog}
      />
    </Box>
  );
};

interface LabCardProps {
  id: string;
  title: string;
  onClickDelete: () => Promise<void>;
}

const LabCard: React.FC<LabCardProps> = ({ id, title, onClickDelete }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onClickDelete();
  };

  return (
    <Card>
      <Link href={RoutePath.labItem({ labId: id })}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
        </CardContent>
      </Link>
      <Divider />
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          loading={loading}
          size="small"
          color="warning"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

interface LabListProps {
  initialLabItems: QuickLabMetadata[];
}

const LabList: React.FC<LabListProps> = ({ initialLabItems }) => {
  const [labItems, setLabItems] =
    React.useState<QuickLabMetadata[]>(initialLabItems);
  const router = useRouter();

  const handleCreateLab = (item: QuickLab) => {
    setLabItems([
      ...labItems,
      { id: item.id, name: item.name, createdAt: item.createdAt },
    ]);
    router.push(RoutePath.labItem({ labId: item.id }));
  };

  const handleDeleteLab = async (id: string) => {
    await deleteLabView(id);
    setLabItems([...labItems.filter((item) => item.id !== id)]);
  };

  return (
    <SimpleListView
      gridView
      items={labItems}
      renderHeader={() => <LabListHeader onCreateLab={handleCreateLab} />}
      renderItem={(labItem) => (
        <Grid item key={labItem.id} sm={3}>
          <LabCard
            id={labItem.id}
            title={labItem.name}
            onClickDelete={async () => {
              await handleDeleteLab(labItem.id);
            }}
          />
        </Grid>
      )}
      noItemsMessage={'Get started by creating a lab!'}
    />
  );
};

export default LabList;
