'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Box, Grid } from '@mui/material';
import HotswapFlowDiagram, { HOTSWAP_NODE_LIST } from './flow_diagram';
import { Button } from '@palico-ai/components';
import { sample } from 'lodash';
import { HighlightSpan, LearnMoreButton } from '../client_fragments';
import RefreshIcon from '@mui/icons-material/Refresh';
import RoutePath from '../../../../utils/route_path';

const pickNodes = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const prompt = sample(HOTSWAP_NODE_LIST.prompts)!.id;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const model = sample(HOTSWAP_NODE_LIST.model)!.id;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dataset = sample(HOTSWAP_NODE_LIST.rag)!.id;
  const shouldPostProcess = Math.random() > 0.5;
  return {
    prompt,
    model,
    dataset,
    shouldPostProcess,
  };
};

const AppConfigHotSwap: React.FC = () => {
  const [nodeConfig, setNodeConfig] = React.useState(pickNodes());

  return (
    <SectionLayout
      title="Hot-Swap Models, Prompts, Anything and Everything"
      subtitle={
        <>
          Swap <HighlightSpan>any component</HighlightSpan> of your application
          layer for any request to discover what works and what doesn&apos;t
        </>
      }
      disableTitleGutter
    >
      <Grid container spacing={2} mt={6}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => {
              setNodeConfig(pickNodes());
            }}
          >
            Swap
          </Button>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              height: '60vh',
            }}
          >
            <HotswapFlowDiagram
              edges={[
                {
                  id: '0',
                  source: HOTSWAP_NODE_LIST.input.id,
                  target: nodeConfig.prompt,
                  animated: true,
                },
                {
                  id: '1',
                  source: nodeConfig.prompt,
                  target: nodeConfig.dataset,
                  animated: true,
                },
                {
                  id: '2',
                  source: nodeConfig.dataset,
                  target: nodeConfig.model,
                  animated: true,
                },
                {
                  id: '3',
                  animated: true,
                  source: nodeConfig.model,
                  target: nodeConfig.shouldPostProcess
                    ? HOTSWAP_NODE_LIST.postProcess.id
                    : HOTSWAP_NODE_LIST.respond.id,
                },
                ...(nodeConfig.shouldPostProcess
                  ? [
                      {
                        id: '4',
                        source: HOTSWAP_NODE_LIST.postProcess.id,
                        target: HOTSWAP_NODE_LIST.respond.id,
                        animated: true,
                      },
                    ]
                  : []),
              ]}
            />
          </Box>
        </Grid>
        {/* <Grid item xs={12} md={5}>
          <Editor
            value={callAgentWithAppConfig({
              model: nodeConfig.model,
              prompt: nodeConfig.prompt,
              dataset: nodeConfig.dataset,
              postProcess: nodeConfig.shouldPostProcess,
            })}
            language="typescript"
            options={{
              readOnly: true,
              fontSize: 16,
              minimap: {
                enabled: false,
              },
            }}
          />
        </Grid> */}
        <Grid item xs={12} md={12}>
          <LearnMoreButton href={RoutePath.docsAppConfig()} />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default AppConfigHotSwap;
