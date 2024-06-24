'use client';

import { Box } from '@mui/material';
import { Button, useDialogController } from '@palico-ai/components';
import NewAnalysisForm from '../../../../../components/forms/new_analysis';
import {
  useExperimentName,
  useEvalName,
} from '../../../../../hooks/use_params';

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
      <NewAnalysisForm
        experimentName={experimentName}
        initialEvals={[
          {
            experimentName: decodeURIComponent(experimentName),
            evalName: decodeURIComponent(evalName),
          },
        ]}
        isOpen={isCreateAnalysisFormOpen}
        closeForm={closeCreateAnalysisForm}
      />
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={openCreateAnalysisForm}
      >
        Comapre
      </Button>
    </Box>
  );
};

export default ExperimentTestTopbarAction;
