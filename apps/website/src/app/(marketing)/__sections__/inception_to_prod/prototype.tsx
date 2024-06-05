'use client';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { LoomEmbed, Typography } from '@palico-ai/components';
import React from 'react';

enum TabName {
  PalicoStudio = 'Palico Studio',
  QuickLab = 'Compare Response',
  Chat = 'Mock Chat',
}

interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, isActive }) => {
  return <Box hidden={!isActive}>{children}</Box>;
};

interface TabPanelGroupProps {
  activeTab: TabName;
}

const DescriptionTabPanels: React.FC<TabPanelGroupProps> = ({ activeTab }) => {
  return (
    <Box>
      <TabPanel isActive={activeTab === TabName.PalicoStudio}>
        <Typography variant="body1" mt={2}>
          Palico Studio is a visual editor that lets you create and iterate on
          your models with a drag-and-drop interface.
        </Typography>
      </TabPanel>
      <TabPanel isActive={activeTab === TabName.QuickLab}>
        <Typography variant="body1" mt={2}>
          Quick Lab is a Jupyter notebook environment that lets you prototype
          and iterate on your models with a Python interface.
        </Typography>
      </TabPanel>
      <TabPanel isActive={activeTab === TabName.Chat}>
        <Typography variant="body1" mt={2}>
          Chat is a real-time collaboration tool that lets you chat with your
          team and share your work.
        </Typography>
      </TabPanel>
    </Box>
  );
};

const VisualTabPanels: React.FC<TabPanelGroupProps> = ({ activeTab }) => {
  const embedUrl =
    'https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=68b7ebec-2b0c-4c3e-adfb-4f695b765024';
  return (
    <Box>
      <TabPanel isActive={activeTab === TabName.PalicoStudio}>
        <LoomEmbed url={embedUrl} />
      </TabPanel>
      <TabPanel isActive={activeTab === TabName.QuickLab}>
        <LoomEmbed url={embedUrl} />
      </TabPanel>
      <TabPanel isActive={activeTab === TabName.Chat}>
        <LoomEmbed url={embedUrl} />
      </TabPanel>
    </Box>
  );
};

const PrototypeAndIterate: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(TabName.PalicoStudio);
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
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
          >
            <Tab value={TabName.PalicoStudio} label={TabName.PalicoStudio} />
            <Tab value={TabName.QuickLab} label={TabName.QuickLab} />
            <Tab value={TabName.Chat} label={TabName.Chat} />
          </Tabs>
          <DescriptionTabPanels activeTab={activeTab} />
        </Grid>
        <Grid item xs={12} md={6}>
          <VisualTabPanels activeTab={activeTab} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrototypeAndIterate;
