'use client';

import {
  Box,
  Tab as MUITab,
  TabProps,
  Tabs as MUITabs,
  TabsProps,
} from '@mui/material';
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
  return <Box hidden={value !== activeTab}>{children}</Box>;
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
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            variant="fullWidth"
            textColor={textColor}
            indicatorColor={indicatorColor}
          >
            {tabs.map((tab) => (
              <Tab
                sx={() => ({
                  minHeight: '38px',
                  maxHeight: '38px',
                  '&.MuiButtonBase-root': {
                    fontSize: '12px',
                  },
                })}
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
        </Box>
        <Box mt={1}>{children}</Box>
      </Box>
    </TabContext.Provider>
  );
};

export const Tabs: React.FC<TabsProps> = ({
  sx,
  textColor = 'inherit',
  indicatorColor = 'primary',
  ...props
}) => {
  return (
    <MUITabs
      textColor={textColor}
      indicatorColor={indicatorColor}
      sx={(theme) => ({
        minHeight: '40px',
        maxHeight: '40px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        ...(sx as object),
      })}
      {...props}
    />
  );
};

export const Tab: React.FC<TabProps> = ({ sx, ...props }) => {
  return (
    <MUITab
      sx={() => ({
        minHeight: '38px',
        maxHeight: '38px',
        '&.MuiButtonBase-root': {
          fontSize: '12px',
        },
        ...(sx as object),
      })}
      {...props}
    />
  );
};
