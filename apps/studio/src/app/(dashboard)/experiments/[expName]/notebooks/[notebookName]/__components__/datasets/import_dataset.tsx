import { Box, Button, Divider, IconButton, Paper } from '@mui/material';
import { Typography, useDialogController } from '@palico-ai/components';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import React from 'react';
import ImportDatasetForm from './dataset_form';
import { useDatasetManipulation } from '../notebook.context';
import { DatasetMetadata } from '@palico-ai/common';

interface ImportedDatasetProps extends DatasetMetadata {
  handleDeleteDataset: () => void;
}

const ImportedDataset: React.FC<ImportedDatasetProps> = ({
  label,
  experimentName,
  evalName: evaluationName,
  handleDeleteDataset,
}) => {
  return (
    <Paper
      sx={{
        minWidth: 250,
        padding: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="subtitle2" fontSize={18} fontWeight={'bold'}>
          {label}
        </Typography>
        <IconButton color="warning" onClick={handleDeleteDataset}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="body2">
          Experiment: {decodeURIComponent(experimentName)}
        </Typography>
        <Typography variant="body2">
          Evaluation: {decodeURIComponent(evaluationName)}
        </Typography>
      </Box>
    </Paper>
  );
};

const ImportDatasetRow: React.FC = () => {
  const { datasets, handleAddDataset, handleDeleteDataset } =
    useDatasetManipulation();
  const {
    isOpen: isImportDatasetFormOpen,
    open: openImportDatasetForm,
    close: closeImportDatasetForm,
  } = useDialogController();

  return (
    <Box>
      <ImportDatasetForm
        isOpen={isImportDatasetFormOpen}
        handleSubmit={handleAddDataset}
        close={closeImportDatasetForm}
      />
      <Box
        sx={() => ({
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        })}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={openImportDatasetForm}
          >
            Import Dataset
          </Button>
        </Box>
        <Box
          sx={(theme) => ({
            padding: 2,
            borderRadius: 1,
            // borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            flexWrap: 'wrap',
          })}
        >
          {datasets.length === 0 && (
            <Typography variant="body1">
              No datasets imported. Get started by importing a dataset
            </Typography>
          )}
          {datasets.map((dataset, index) => {
            return (
              <ImportedDataset
                key={index}
                handleDeleteDataset={() => handleDeleteDataset(dataset.label)}
                label={dataset.label}
                experimentName={dataset.experimentName}
                evalName={dataset.evalName}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ImportDatasetRow;
