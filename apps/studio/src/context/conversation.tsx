'use client';

import React, { useState } from 'react';

export type ConversationContextParams = {
  agentName?: string;
  setAgent: (name: string) => void;
};

export const ConversationContext =
  React.createContext<ConversationContextParams>(
    {} as ConversationContextParams
  );

export interface ConversationContextProviderProps {
  children: React.ReactNode;
  agentName?: string;
}

export const ConversationContextProvider: React.FC<
  ConversationContextProviderProps
> = ({ children, agentName: initialAgentName }) => {
  const [agentName, setAgent] = useState(initialAgentName);

  return (
    <ConversationContext.Provider
      value={{
        agentName,
        setAgent,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
