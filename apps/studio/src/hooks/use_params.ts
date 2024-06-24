import { useParams } from 'next/navigation';

export const useExperimentName = () => {
  const { expName } = useParams<{ expName: string }>();
  return expName;
};

export const useEvalName = () => {
  const { evalName } = useParams<{ evalName: string }>();
  return evalName;
};
