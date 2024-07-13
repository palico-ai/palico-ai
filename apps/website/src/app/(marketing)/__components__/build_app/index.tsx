import React from 'react';
import SectionLayout from '../section_layout';
import { CodeSnippetTab, ContentWithMedia } from '../layouts';
import {
  appConfigCodeSnippet,
  langchainCodeSnippet,
  pineconeCodeSnippet,
  portkeyCodeSnippet,
} from '../constants/code_snippet';
import { LoomEmbed, TabPanel, TabView } from '@palico-ai/components';

const BuildModularApp: React.FC = () => {
  return (
    <SectionLayout title="Build Your LLM Application" alignTitle={'left'}>
      <ContentWithMedia
        title="Build an interchangable application layer"
        descriptions={[
          'To be able to test different combinations of prompts, models, and contexts, you need to build a modular application layer',
          <>
            Palico does this by providing the <code>context.appConfig</code>{' '}
            object, which lets you execute different variations of LLM
            applications on each request
          </>,
        ]}
        media={
          <CodeSnippetTab
            tabs={[
              {
                label: 'App Config Example',
                codeSnippet: appConfigCodeSnippet,
              },
            ]}
            height={320}
          />
        }
      />
      <ContentWithMedia
        title="Use any external tools and libraries"
        descriptions={[
          'Palico is designed to be flexible and extensible. You can use any external tools and libraries to build your LLM applications',
        ]}
        media={
          <CodeSnippetTab
            tabs={[
              {
                label: 'Portkey',
                codeSnippet: portkeyCodeSnippet,
              },
              {
                label: 'LangChain',
                codeSnippet: langchainCodeSnippet,
              },
              {
                label: 'Pinecone',
                codeSnippet: pineconeCodeSnippet,
              },
            ]}
            height={320}
          />
        }
      />
      <ContentWithMedia
        title="Locally preview your changes"
        descriptions={[
          'Use Palico Studio to Chat with your LLM application or compare responses from different version of your LLM application side-by-side',
          'Palico Studio is your application control panel that runs locally on your machine during development, and in the cloud during production',
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
            ]}
          >
            <TabPanel value="chat">
              <LoomEmbed url="https://www.loom.com/embed/c5a298a21d834248b9891c21be78d84d?sid=125547ea-e125-4589-a6ab-c6036a5fe4b1" />
            </TabPanel>
            <TabPanel value="compare">
              <LoomEmbed url="https://www.loom.com/embed/02564c10cd9e46828bb14ba277b656dd?sid=c78aa4ed-418e-48d6-82d6-36852ff53e12" />
            </TabPanel>
          </TabView>
        }
      />
    </SectionLayout>
  );
};

export default BuildModularApp;
