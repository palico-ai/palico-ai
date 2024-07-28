'use client';

import { NotebookMetadata } from '@palico-ai/common';
import { ComponentWithChildren } from '@palico-ai/components';
import React from 'react';
import { createContext } from 'react';

interface NotebookListContextProps {
  notebooks: NotebookMetadata[];
  setNotebooks: (notebooks: NotebookMetadata[]) => void;
}

const NotebookListContext = createContext<NotebookListContextProps>(
  {} as NotebookListContextProps
);

interface NotebookListContextProviderProps extends ComponentWithChildren {
  initialNotebooks: NotebookMetadata[];
}

export const NotebookListContextProvider: React.FC<
  NotebookListContextProviderProps
> = ({ initialNotebooks, children }) => {
  const [notebooks, setNotebooks] = React.useState(initialNotebooks);

  return (
    <NotebookListContext.Provider value={{ notebooks, setNotebooks }}>
      {children}
    </NotebookListContext.Provider>
  );
};

export default NotebookListContext;
