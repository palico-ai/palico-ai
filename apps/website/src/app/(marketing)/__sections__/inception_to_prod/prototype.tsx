'use client';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { LoomEmbed, Typography } from '@palico-ai/components';
import React from 'react';
import { LandingPageData } from '../../data';

interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, isActive }) => {
  return <Box hidden={!isActive}>{children}</Box>;
};

interface TabPanelGroupProps {
  activeTabIndex: number;
}

const DescriptionTabPanels: React.FC<TabPanelGroupProps> = ({
  activeTabIndex,
}) => {
  return (
    <Box>
      {LandingPageData.protoToProd.sections.prototype.tabs.map((tab, index) => (
        <TabPanel key={index} isActive={activeTabIndex === index}>
          <Typography variant="body1" mt={2}>
            {tab.description}
          </Typography>
        </TabPanel>
      ))}
    </Box>
  );
};

const VisualTabPanels: React.FC<TabPanelGroupProps> = ({
  activeTabIndex: activeTab,
}) => {
  return (
    <Box>
      {LandingPageData.protoToProd.sections.prototype.tabs.map((tab, index) => (
        <TabPanel key={index} isActive={activeTab === index}>
          <LoomEmbed url={tab.demoUrl} />
        </TabPanel>
      ))}
    </Box>
  );
};

const PrototypeAndIterate: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Prototype and iterate quickly
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Tabs
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
            variant="fullWidth"
            value={activeTabIndex}
            onChange={(_, value) => setActiveTabIndex(value)}
          >
            {LandingPageData.protoToProd.sections.prototype.tabs.map(
              (tab, index) => (
                <Tab key={index} label={tab.label} value={index} />
              )
            )}
          </Tabs>
          <DescriptionTabPanels activeTabIndex={activeTabIndex} />
        </Grid>
        <Grid item xs={12} md={6}>
          <VisualTabPanels activeTabIndex={activeTabIndex} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrototypeAndIterate;
