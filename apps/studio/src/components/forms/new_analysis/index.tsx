'use client';

import { EvalJobKeyID } from '@palico-ai/common';
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
import { getAllEvals } from '../../../services/metadata';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../utils/route_path';

export interface NewAnalysisFormProps {
  experimentName: string;
  isOpen: boolean;
  closeForm: () => void;
  initialEvals?: EvalJobKeyID[];
}

const NewAnalysisForm: React.FC<NewAnalysisFormProps> = ({
  isOpen,
  initialEvals: initialTests,
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
    task: getAllEvals,
  });
  const [selectedTests, setSelectedTests] = React.useState<EvalJobKeyID[]>(
    initialTests ?? []
  );
  const router = useRouter();

  console.log(`selectedTests: `, selectedTests);

  React.useEffect(() => {
    runTask({});
  }, [runTask]);

  const datasetOptions: CheckboxAutocompleteProps['options'] =
    React.useMemo(() => {
      return (
        allTests?.map((test: EvalJobKeyID) => ({
          label: test.evalName,
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
            label: 'Evaluations',
          }}
          groupBy={(option) => {
            const test = option.value as EvalJobKeyID;
            return test.experimentName;
          }}
          value={selectedTests}
          onChange={(values) => {
            setSelectedTests(values.map((value) => value as EvalJobKeyID));
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
      `&evals=${JSON.stringify(selectedTests)}`;
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
