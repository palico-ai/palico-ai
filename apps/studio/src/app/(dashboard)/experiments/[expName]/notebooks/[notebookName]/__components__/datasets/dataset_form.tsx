import { DatasetMetadata, EvalCompositeKey } from '@palico-ai/common';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Form,
  TextField,
  Typography,
} from '@palico-ai/components';
import React, { useMemo } from 'react';
import useAsyncTask from '../../../../../../../../hooks/use_async_task';
import { getAllEvals } from '../../../../../../../../services/metadata';

interface ImportDatasetFormProps {
  isOpen: boolean;
  handleSubmit: (dataset: DatasetMetadata) => Promise<void>;
  close: () => void;
}

const ImportDatasetForm: React.FC<ImportDatasetFormProps> = ({
  handleSubmit,
  isOpen,
  close,
}) => {
  const {
    data: evaluationList,
    runTask: fetchEvals,
    pendingInitialFetch,
  } = useAsyncTask({
    task: getAllEvals,
  });
  const { loading: isSubmitting, runTask: handleSubmitForm } = useAsyncTask({
    task: handleSubmit,
  });
  const [selectedEval, setSelectedEval] =
    React.useState<EvalCompositeKey | null>(null);
  const [label, setLabel] = React.useState<string>();
  const [errorMessages, setErrorMessages] = React.useState<string>();

  const onClickSubmit = async () => {
    try {
      setErrorMessages(undefined);
      if (!selectedEval || !label) {
        throw new Error('Please fill in all fields');
      }
      await handleSubmitForm({
        label,
        ...selectedEval,
      });
      close();
      setLabel('');
      setSelectedEval(null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred';
      setErrorMessages(errorMessage);
    }
  };

  React.useEffect(() => {
    fetchEvals({});
  }, [fetchEvals]);

  const contentJSX = useMemo(() => {
    return (
      <>
        <TextField
          fullWidth
          required
          autoComplete="off"
          gutterBottom
          label="Dataset Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Autocomplete
          options={evaluationList ?? []}
          getOptionLabel={(option) => option.evalName}
          groupBy={(option) => option.experimentName}
          value={selectedEval}
          onChange={(event, newValue) => setSelectedEval(newValue)}
          renderInput={(params) => (
            <TextField required label="Evaluation" {...params} />
          )}
        />
      </>
    );
  }, [evaluationList, label, selectedEval]);

  return (
    <Dialog open={isOpen} onClose={close} fullWidth>
      <DialogTitle>New Analysis</DialogTitle>
      <Form onSubmit={onClickSubmit}>
        <DialogContent>
          {errorMessages?.length && (
            <Typography variant="body1" color={'error'}>
              {errorMessages}
            </Typography>
          )}
          {pendingInitialFetch ? <div>Loading...</div> : contentJSX}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="text" onClick={close}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            loading={isSubmitting}
          >
            Import
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ImportDatasetForm;
