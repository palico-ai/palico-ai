import React from 'react';
import SectionLayout from '../section_layout';
import { ContentWithMedia } from '../layouts';
import { LoomEmbed, TabPanel, TabView } from '@palico-ai/components';

const ControlPanel: React.FC = () => {
  return (
    <SectionLayout
      title="Palico Studio - Your Application Control Panel"
      alignTitle={'left'}
    >
      <ContentWithMedia
        centerContent
        descriptions={[
          'Prototype and chat with your application, manage your experiments, and review runtime traces in Palico Studio',
        ]}
        media={
          <TabView
            tabs={[
              {
                label: 'Chat',
                value: 'chat',
              },
              {
                label: 'Compare',
                value: 'compare',
              },
              {
                label: 'Experiment',
                value: 'experiment',
              },
              {
                label: 'Tracing',
                value: 'tracing',
              },
            ]}
          >
            <TabPanel value="chat">
              <LoomEmbed url="https://www.loom.com/embed/c5a298a21d834248b9891c21be78d84d?sid=125547ea-e125-4589-a6ab-c6036a5fe4b1" />
            </TabPanel>
            <TabPanel value="compare">
              <LoomEmbed url="https://www.loom.com/embed/02564c10cd9e46828bb14ba277b656dd?sid=c78aa4ed-418e-48d6-82d6-36852ff53e12" />
            </TabPanel>
            <TabPanel value="experiment">
              <LoomEmbed url="https://www.loom.com/embed/ac36ce6824c241b891c3bb4c246dfdf4?sid=da7b200d-7724-4ce0-93d2-1bffab6a3569" />
            </TabPanel>
            <TabPanel value="tracing">
              <LoomEmbed url="https://www.loom.com/embed/1c7a450c2b5c46bab09381a9759d4b34?sid=2c9f7898-380d-49f9-920a-8d5cd67928e0" />
            </TabPanel>
          </TabView>
        }
      />
    </SectionLayout>
  );
};

export default ControlPanel;
