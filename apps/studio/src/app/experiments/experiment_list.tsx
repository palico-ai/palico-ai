'use client';

import {
  Link,
  Card,
  SimpleListView,
  Typography,
  FormField,
  useDialogController,
  Button,
  SimpleDialogForm,
  CardActions,
} from '@palico-ai/components';
import React from 'react';
import { RoutePath } from '../../utils/route_path';
import { Box, CardHeader, Chip, Divider, Stack } from '@mui/material';
import { ExperimentMetadata } from '@palico-ai/common';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createExperiment, deleteExperiment } from '../../services/experiments';

const CreateExperimentFormField: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
];

export interface ExperimentListHeaderProps {
  onCreateExperiment: (item: ExperimentMetadata) => void;
}

const ExperimentListHeader: React.FC<ExperimentListHeaderProps> = ({
  onCreateExperiment,
}) => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const handleCreateExp = async (
    data: Record<string, string>
  ): Promise<void> => {
    try {
      const item = await createExperiment({
        name: data.name,
      });
      onCreateExperiment(item);
    } catch (err) {
      console.log(err);
      const message = (err as Error).message || 'Failed to create experiment';
      toast.error(message);
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
          New Experiment
        </Button>
      </Box>
      <SimpleDialogForm
        title="Create New Experiment"
        formFields={CreateExperimentFormField}
        isOpen={isOpen}
        onSubmit={handleCreateExp}
        closeForm={closeDialog}
      />
    </Box>
  );
};

interface ExperimentCardProps {
  experiment: ExperimentMetadata;
  onClickDelete: () => Promise<void>;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment: { name, tags, createdAt },
  onClickDelete,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onClickDelete();
  };

  return (
    <Card>
      <Link href={RoutePath.experimentItem({ experimentName: name })}>
        <CardHeader
          title={<Typography variant="h6">{name}</Typography>}
          subheader={
            tags.length > 0
              ? tags.map((tag) => (
                  <Stack key={tag} direction="row" spacing={1}>
                    <Chip label={tag} />
                  </Stack>
                ))
              : undefined
          }
        />
      </Link>
      <Divider />
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" pl={1}>
          {new Date(createdAt).toDateString()}{' '}
          {new Date(createdAt).toLocaleTimeString()}
        </Typography>
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

interface ExpListProps {
  initialExpItems: ExperimentMetadata[];
}

const ExperimentList: React.FC<ExpListProps> = ({ initialExpItems }) => {
  const [expItems, setExpItems] = React.useState<ExperimentMetadata[]>(
    initialExpItems || []
  );
  const router = useRouter();

  const handleCreateExp = (item: ExperimentMetadata) => {
    setExpItems([...expItems, { ...item }]);
    router.push(RoutePath.experimentTestList({ experimentName: item.name }));
  };

  const handleDeleteExp = async (name: string) => {
    await deleteExperiment(name);
    setExpItems([...expItems.filter((item) => item.name !== name)]);
  };

  return (
    <SimpleListView
      items={expItems}
      renderHeader={() => (
        <ExperimentListHeader onCreateExperiment={handleCreateExp} />
      )}
      renderItem={(expItem) => (
        <Box
          sx={{
            mb: 2,
          }}
        >
          <ExperimentCard
            experiment={expItem}
            onClickDelete={async () => {
              await handleDeleteExp(expItem.name);
            }}
          />
        </Box>
      )}
      noItemsMessage={'Get started by creating an experiment!'}
    />
  );
};

export default ExperimentList;
