import { useParams } from "next/navigation";

export const useExperimentName = () => {
  const { expName } = useParams<{ expName: string }>();
  return expName;
}

export const useTestName = () => {
  const { testName } = useParams<{ testName: string }>();
  return testName;
}