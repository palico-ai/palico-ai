import React from 'react';
import SectionLayout from '../section_layout';
import { Grid } from '@mui/material';
import { DocRoute } from '../../../../utils/route_path';
import { LearnMoreButton } from '../client_fragments';
import LangchainLogo from '../../../../../public/logos/langchain.png';
import LlamaIndex from '../../../../../public/logos/llamaindex.png';
import Portkey from '../../../../../public/logos/portkey.png';
import OpenAI from '../../../../../public/logos/openai.svg';
import Anthropic from '../../../../../public/logos/anthropic.png';
import Cohere from '../../../../../public/logos/cohere.png';
import Azure from '../../../../../public/logos/azure.png';
import Bedrock from '../../../../../public/logos/bedrock.png';
import GoogleCloud from '../../../../../public/logos/google_cloud.png';
import Pinecone from '../../../../../public/logos/pinecone.png';
import PGVector from '../../../../../public/logos/postgres.png';
import Chroma from '../../../../../public/logos/chroma.png';
import LibraryItem, { LibraryItemProps } from './integ_item';

const libraries: LibraryItemProps[] = [
  {
    title: 'LangChain',
    image: LangchainLogo,
    link: DocRoute.docsLangChain(),
  },
  {
    title: 'LlamaIndex',
    image: LlamaIndex,
    link: DocRoute.docsLlamaIndex(),
  },
  {
    title: 'Portkey',
    image: Portkey,
    link: DocRoute.docsPortkey(),
  },
  {
    title: 'OpenAI',
    image: OpenAI,
    link: DocRoute.docsOpenAI(),
  },
  {
    title: 'Anthropic',
    image: Anthropic,
    link: DocRoute.docsAnthropic(),
  },
  {
    title: 'Cohere',
    image: Cohere,
    link: DocRoute.docsModelProviders(),
  },
  {
    title: 'Azure',
    image: Azure,
    link: DocRoute.docsModelProviders(),
  },

  {
    title: 'AWS Bedrock',
    image: Bedrock,
    link: DocRoute.docsAwsBedrock(),
  },
  {
    title: 'GCP Vertex',
    image: GoogleCloud,
    link: DocRoute.docsGcpVertex(),
  },
  {
    title: 'Pinecone',
    image: Pinecone,
    link: DocRoute.docsPinecone(),
  },
  {
    title: 'PG Vector',
    image: PGVector,
    link: DocRoute.docsPGVector(),
  },
  {
    title: 'Chroma',
    image: Chroma,
    link: DocRoute.docsChroma(),
  },
];

const Integrations: React.FC = () => {
  return (
    <SectionLayout title="Works With Your Favorite Tools And Libraries">
      <Grid container spacing={4}>
        {libraries.map((library, index) => (
          <Grid key={index} item xs={6} sm={6} md={3} lg={2}>
            <LibraryItem {...library} />
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <LearnMoreButton
            label="Explore Integrations"
            href={DocRoute.docs()}
          />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default Integrations;
