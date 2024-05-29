'use client';

import React, { createContext, useState } from 'react';
import { TestDataset } from './test_datasets/test_dataset';
import { ExperimentTestCaseResult } from '@palico-ai/common';

export interface DataframeDataset extends ExperimentTestCaseResult {
  experimentName: string;
  testName: string;
}

export interface Dataframe {
  label: string;
  dataset: DataframeDataset[];
}

export interface AnalysisContextParams {
  dataframes: Dataframe[];
  setDataframes: (dataframes: Dataframe[]) => void;
}

const AnalysisContext = createContext<AnalysisContextParams>({
  dataframes: [],
  setDataframes: () => {
    throw new Error('setDataframes not implemented');
  },
});

export interface AnalysisContextProviderProps {
  children: React.ReactNode;
}

export const AnalysisContextProvider: React.FC<
  AnalysisContextProviderProps
> = ({ children }) => {
  const [dataframes, setDataframes] = useState<Dataframe[]>(TestDataset);

  return (
    <AnalysisContext.Provider value={{ dataframes: dataframes, setDataframes }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export default AnalysisContext;
