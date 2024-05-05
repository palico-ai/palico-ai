'use client';

import { Box, Tab, Tabs, TabsProps } from '@mui/material';
import React from 'react';

interface TabContextParams {
  activeTab: string;
}

const TabContext = React.createContext<TabContextParams>({
  activeTab: '0',
});

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value }) => {
  const { activeTab } = React.useContext(TabContext);
  return <div hidden={value !== activeTab}>{children}</div>;
};

interface TabItemProps {
  label: string;
  value: string;
}

interface TabViewProps {
  tabs: TabItemProps[];
  children: React.ReactNode;
  textColor?: TabsProps['textColor'];
  indicatorColor?: TabsProps['indicatorColor'];
}

export const TabView: React.FC<TabViewProps> = ({
  textColor = 'inherit',
  indicatorColor = 'primary',
  tabs,
  children,
}) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <TabContext.Provider value={{ activeTab }}>
      <Box sx={{ width: '100%' }}>
        <Tabs
          sx={{
            mb: 1,
          }}
          value={activeTab}
          onChange={handleChangeTab}
          textColor={textColor}
          indicatorColor={indicatorColor}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <Box>{children}</Box>
      </Box>
    </TabContext.Provider>
  );
};
