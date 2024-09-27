'use client';

import { Box } from '@mui/material';
import { Button, useDialogController } from '@palico-ai/components';
import {
  useExperimentName,
  useEvalName,
} from '../../../../../../hooks/use_params';
import AnalyzeEvalForm from './analyze_form';

const ExperimentTestTopbarAction: React.FC = () => {
  const {
    isOpen: isCreateAnalysisFormOpen,
    open: openCreateAnalysisForm,
    close: closeCreateAnalysisForm,
  } = useDialogController();
  const experimentName = useExperimentName();
  const evalName = useEvalName();
  return (
    <Box>
      <AnalyzeEvalForm
        isOpen={isCreateAnalysisFormOpen}
        closeForm={closeCreateAnalysisForm}
        experimentName={experimentName}
        evalName={evalName}
      />
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={openCreateAnalysisForm}
      >
        Analyze in Notebook
      </Button>
    </Box>
  );
};

export default ExperimentTestTopbarAction;
