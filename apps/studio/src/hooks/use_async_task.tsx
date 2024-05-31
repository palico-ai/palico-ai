import React, { useCallback } from 'react';

export type AsyncTask<Data = unknown, TaskInput = unknown> = (
  input: TaskInput
) => Promise<Data>;

export interface UseAsyncTask<Data = unknown, TaskInput = unknown> {
  runTask: AsyncTask<Data, TaskInput>;
  data?: Data;
  loading: boolean;
  errorMessage?: string;
  pendingInitialFetch: boolean;
}

export interface UseAsyncTaskInput<Data = unknown, TaskInput = unknown> {
  task: AsyncTask<Data, TaskInput>;
}

const useAsyncTask = <Data, TaskInput = unknown>(
  params: UseAsyncTaskInput<Data, TaskInput>
): UseAsyncTask<Data, TaskInput> => {
  const { task } = params;
  const [data, setData] = React.useState<Data>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [pendingInitialFetch, setPendingInitialFetch] = React.useState(false);

  const runTaskFN = useCallback(
    async (input: TaskInput) => {
      setLoading(true);
      setErrorMessage(undefined);
      try {
        const result = await task(input);
        setData(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setErrorMessage(errorMessage);
        throw error;
      } finally {
        setLoading(false);
        setPendingInitialFetch(false);
      }
    },
    [task]
  );

  return {
    runTask: runTaskFN,
    data,
    loading,
    errorMessage,
    pendingInitialFetch: pendingInitialFetch,
  };
};

export default useAsyncTask;
