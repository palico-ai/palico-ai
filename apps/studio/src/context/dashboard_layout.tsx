'use client';

import { createContext, useState } from 'react';

export interface DashboardLayoutContextParams {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const DashboardLayoutContext =
  createContext<DashboardLayoutContextParams>({
    sidebarOpen: false,
    toggleSidebar: () => {
      return;
    },
  });

export interface DashboardLayoutContextProviderProps {
  children: React.ReactNode;
}

export const DashboardLayoutContextProvider: React.FC<
  DashboardLayoutContextProviderProps
> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardLayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};

export default DashboardLayoutContextProvider;
