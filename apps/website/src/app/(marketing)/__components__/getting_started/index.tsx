import React from 'react';
import SectionLayout from '../section_layout';
import { Box, Grid } from '@mui/material';
import { SyntaxHighlighter, Typography } from '@palico-ai/components';
import CookbookCard, { CookbookCardProps } from './cookbook_card';
import AppRoute, { DocRoute } from '../../../../utils/route_path';

const COOKBOOK_LIST: CookbookCardProps[] = [
  {
    title: 'Build A RAG Application',
    description:
      'Learn how to build an LLM application using Vector Database and LLM models',
    link: DocRoute.docsBuildARagApp(),
  },
  {
    title: 'Build a Chatbot',
    description:
      'Create a chatbot that can recall previous conversations using external memory',
    link: DocRoute.docsChatbot(),
  },
  {
    title: 'AI Text Editor',
    description:
      'Create a text editor with AI that helps users summarize, translate, and more',
    link: DocRoute.docsAiTextEditor(),
  },
  {
    title: 'Categorize Articles',
    description:
      'Scrape articles from a website, classify it, and extract metadata',
    link: DocRoute.docsClassifyDocuments(),
  },
  {
    title: 'Unstructured to JSON',
    description: 'Convert unstructured documents to a structured JSON format',
    link: DocRoute.docsUnstructuredToJSON(),
  },
  {
    title: 'Text to SQL',
    description:
      'Using natural language to query from a user, and convert it to a valid SQL query',
    link: DocRoute.docsConvertTextToSQL(),
  },
];

const GettingStartedFragment: React.FC = () => {
  return (
    <SectionLayout
      alignTitle={'center'}
      title="Get Started in Seconds"
      disableTitleGutter
    >
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SyntaxHighlighter
          language="bash"
          customStyle={{
            fontSize: '18px',
            // lineHeight: '30px',
            borderRadius: '8px',
          }}
          codeTagProps={{
            style: {
              lineHeight: 'inherit',
              fontSize: 'inherit',
            },
          }}
        >
          {`npx palico init <project-name>`}
        </SyntaxHighlighter>
        <Typography
          variant="subtitle2"
          sx={{
            mt: 8,
            mb: 4,
          }}
        >
          Or start by following one of our cookbooks
        </Typography>
        <Grid container spacing={4}>
          {COOKBOOK_LIST.map((cookbook) => (
            <Grid item xs={12} md={4} key={cookbook.title}>
              <CookbookCard {...cookbook} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </SectionLayout>
  );
};

export default GettingStartedFragment;
