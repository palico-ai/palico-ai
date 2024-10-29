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
  Skeleton,
} from '@palico-ai/components';
import React from 'react';
import { RoutePath } from '../../../utils/route_path';
import { Box, Divider, Grid } from '@mui/material';
import {
  createLabView,
  deleteLabView,
  getAllLabViews,
} from '../../../services/studio';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_ALL_QUICK_LABS } from '../../../constants/query_keys';
import { toast } from 'react-toastify';

const CreateLabFormField: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
];

const LabListHeader: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_QUICK_LABS],
      });
      router.push(RoutePath.labItem({ labId: item.id }));
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
}

const LabCard: React.FC<LabCardProps> = ({ id, title }) => {
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending: loading } = useMutation({
    mutationFn: deleteLabView,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_QUICK_LABS],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

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
          onClick={() => {
            handleDelete(id);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

const LabList: React.FC = () => {
  const {
    data: labItems,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [GET_ALL_QUICK_LABS],
    queryFn: async () => {
      const response = await getAllLabViews();
      return response;
    },
  });

  if (isPending) {
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

  if (isError) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" color={'error'}>
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <SimpleListView
      gridView
      items={labItems}
      renderHeader={() => <LabListHeader />}
      renderItem={(labItem) => (
        <Grid item key={labItem.id} sm={3}>
          <LabCard id={labItem.id} title={labItem.name} />
        </Grid>
      )}
      noItemsMessage={'Get started by creating a lab!'}
    />
  );
};

export default LabList;
