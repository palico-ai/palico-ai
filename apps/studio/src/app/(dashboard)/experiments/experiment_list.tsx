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
  ErrorMessage,
  Skeleton,
} from '@palico-ai/components';
import React from 'react';
import { RoutePath } from '../../../utils/route_path';
import { Box, CardHeader, Chip, Divider, Stack } from '@mui/material';
import { ExperimentMetadata } from '@palico-ai/common';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  createExperiment,
  deleteExperiment,
  getExperimentList,
} from '../../../services/experiments';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_ALL_EXPERIMENTS } from '../../../constants/query_keys';

const CreateExperimentFormField: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
];

const ExperimentListHeader: React.FC = () => {
  const {
    isOpen,
    open: openDialog,
    close: closeDialog,
  } = useDialogController();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleCreateExp = async (
    data: Record<string, string>
  ): Promise<void> => {
    try {
      const item = await createExperiment({
        name: data.name,
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_EXPERIMENTS],
      });
      router.push(RoutePath.experimentEvalList({ experimentName: item.name }));
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
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment: { name, tags, createdAt },
}) => {
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setLoading(true);
    await deleteExperiment(name);
    await queryClient.invalidateQueries({
      queryKey: [GET_ALL_EXPERIMENTS],
    });
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

const ExperimentList: React.FC = () => {
  const {
    data: expItems,
    isPending: isPendingExp,
    error: expError,
  } = useQuery({
    queryKey: [GET_ALL_EXPERIMENTS],
    queryFn: async () => {
      const response = await getExperimentList();
      return response;
    },
  });

  if (expError) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ErrorMessage message={expError.message} />
      </Box>
    );
  }

  if (isPendingExp) {
    return (
      <Box
        sx={{
          height: '20vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Skeleton count={5} />
      </Box>
    );
  }

  return (
    <SimpleListView
      items={expItems}
      renderHeader={() => <ExperimentListHeader />}
      renderItem={(expItem) => (
        <Box
          sx={{
            mb: 2,
          }}
        >
          <ExperimentCard experiment={expItem} />
        </Box>
      )}
      noItemsMessage={'Get started by creating an experiment!'}
    />
  );
};

export default ExperimentList;
