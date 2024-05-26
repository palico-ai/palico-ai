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
import { RoutePath } from '../../utils/route_path';
import { Box, Container, Divider } from '@mui/material';
import {
  ExperimentMetadata,
} from '@palico-ai/common';
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
  name: string;
  title: string;
  onClickDelete: () => Promise<void>;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  name,
  title,
  onClickDelete,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onClickDelete();
  };

  return (
    <Card sx={{my: 2}}>
      <Link href={RoutePath.experimentItem({ experimentName:  name})}>
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
    router.push(RoutePath.experimentItem({ experimentName: item.name }));
  };

  const handleDeleteExp = async (name: string) => {
    await deleteExperiment(name);
    setExpItems([...expItems.filter((item) => item.name !== name)]);
  };

  return (
    <Container maxWidth="lg">
      <SimpleListView
        items={expItems}
        renderHeader={() => (
          <ExperimentListHeader onCreateExperiment={handleCreateExp} />
        )}
        renderItem={(expItem) => (
          <ExperimentCard
            name={expItem.name}
            title={expItem.name}
            onClickDelete={async () => {
              await handleDeleteExp(expItem.name);
            }}
          />
        )}
        noItemsMessage={'Get started by creating an experiment!'}
      />
    </Container>
  );
};

export default ExperimentList;
