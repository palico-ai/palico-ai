import { SimpleDialogForm } from '@palico-ai/components';
import { createNotebook } from '../../../../../../services/experiments';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RoutePath } from '../../../../../../utils/route_path';
import { useQueryClient } from '@tanstack/react-query';
import { GET_NOTEBOOKS_FOR_EXPERIMENT } from '../../../../../../constants/query_keys';

interface AnalyzeFormProps {
  isOpen: boolean;
  closeForm: () => void;
  experimentName: string;
  evalName: string;
}

const AnalyzeEvalForm: React.FC<AnalyzeFormProps> = ({
  isOpen,
  closeForm,
  experimentName,
  evalName,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleSubmit = async (data: Record<string, string>) => {
    const { notebookName, datasetLabel } = data;
    if (!notebookName) {
      throw new Error('Notebook name is required');
    }
    if (!datasetLabel) {
      throw new Error('Dataset label is required');
    }
    await createNotebook({
      experimentName,
      notebookName,
      datasetMetadata: [
        {
          experimentName,
          evalName,
          label: datasetLabel,
        },
      ],
      rows: [],
    });
    await queryClient.invalidateQueries({
      queryKey: [GET_NOTEBOOKS_FOR_EXPERIMENT],
    });
    router.push(
      RoutePath.experimentNotebookItem({
        experimentName,
        notebookName,
      })
    );
  };

  return (
    <SimpleDialogForm
      formFields={[
        {
          name: 'notebookName',
          label: 'Notebook Name',
          initialValue: 'Analyze ' + decodeURIComponent(evalName),
        },
        {
          name: 'datasetLabel',
          label: 'Evaluation Dataset Label',
          initialValue: decodeURIComponent(evalName),
        },
      ]}
      title="Analyze Evaluation"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      closeForm={closeForm}
    />
  );
};

export default AnalyzeEvalForm;
