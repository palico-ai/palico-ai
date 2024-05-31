'use client';

import { Box } from '@mui/material';
import { Button, useDialogController } from '@palico-ai/components';
import NewAnalysisForm from '../../../../../components/forms/new_analysis';
import {
  useExperimentName,
  useTestName,
} from '../../../../../hooks/use_params';

const ExperimentTestTopbarAction: React.FC = () => {
  const {
    isOpen: isCreateAnalysisFormOpen,
    open: openCreateAnalysisForm,
    close: closeCreateAnalysisForm,
  } = useDialogController();
  const experimentName = useExperimentName();
  const testName = useTestName();
  return (
    <Box>
      <NewAnalysisForm
        experimentName={experimentName}
        initialTests={[
          {
            experimentName: decodeURIComponent(experimentName),
            testName: decodeURIComponent(testName),
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
