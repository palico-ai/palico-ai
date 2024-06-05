'use client';

import { ExperimentTestKeyID } from '@palico-ai/common';
import {
  Button,
  CheckboxAutocomplete,
  CheckboxAutocompleteProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@palico-ai/components';
import useAsyncTask from '../../../hooks/use_async_task';
import { getAllTests } from '../../../services/metadata';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../utils/route_path';

export interface NewAnalysisFormProps {
  experimentName: string;
  isOpen: boolean;
  closeForm: () => void;
  initialTests?: ExperimentTestKeyID[];
}

const NewAnalysisForm: React.FC<NewAnalysisFormProps> = ({
  isOpen,
  initialTests,
  experimentName,
  closeForm: closeDialog,
}) => {
  const [name, setName] = React.useState(
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
  );
  const {
    data: allTests,
    runTask,
    pendingInitialFetch,
  } = useAsyncTask({
    task: getAllTests,
  });
  const [selectedTests, setSelectedTests] = React.useState<
    ExperimentTestKeyID[]
  >(initialTests ?? []);
  const router = useRouter();

  console.log(`selectedTests: `, selectedTests);

  React.useEffect(() => {
    runTask({});
  }, [runTask]);

  const datasetOptions: CheckboxAutocompleteProps['options'] =
    React.useMemo(() => {
      return (
        allTests?.map((test: ExperimentTestKeyID) => ({
          label: test.testName,
          value: test,
        })) ?? []
      );
    }, [allTests]);

  const contentJSX = useMemo(() => {
    if (pendingInitialFetch) return <div>Loading...</div>;
    return (
      <>
        <TextField
          fullWidth
          gutterBottom
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <CheckboxAutocomplete
          inputProps={{
            label: 'Datasets',
          }}
          groupBy={(option) => {
            const test = option.value as ExperimentTestKeyID;
            return test.experimentName;
          }}
          value={selectedTests}
          onChange={(values) => {
            setSelectedTests(
              values.map((value) => value as ExperimentTestKeyID)
            );
          }}
          options={datasetOptions}
        />
      </>
    );
  }, [datasetOptions, name, pendingInitialFetch, selectedTests]);

  const handleCreate = () => {
    const searchParams =
      '?' +
      `name=${encodeURIComponent(name)}` +
      `&tests=${JSON.stringify(selectedTests)}`;
    router.push(
      RoutePath.experimentNewReportItem({ experimentName }) + searchParams
    );
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth>
      <DialogTitle>New Analysis</DialogTitle>
      <DialogContent>{contentJSX}</DialogContent>
      <DialogActions>
        <Button color="secondary" variant="text" onClick={closeDialog}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewAnalysisForm;
