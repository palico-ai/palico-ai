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
  children?: React.ReactNode;
  textColor?: TabsProps['textColor'];
  onTabChange?: (value: string) => void;
  indicatorColor?: TabsProps['indicatorColor'];
}

export const TabView: React.FC<TabViewProps> = ({
  textColor = 'inherit',
  indicatorColor = 'primary',
  tabs,
  onTabChange,
  children,
}) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0].value);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <TabContext.Provider value={{ activeTab }}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
          })}
        >
          <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            variant="fullWidth"
            textColor={textColor}
            indicatorColor={indicatorColor}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Box mt={1}>{children}</Box>
      </Box>
    </TabContext.Provider>
  );
};

export { Tabs, Tab } from '@mui/material';
