'use client';

import { useQuery } from '@tanstack/react-query';
import { useWorkflowName } from '../../../../hooks/use_params';
import { WORKFLOWS_QUERY_KEY } from '../../../../constants/query_keys';
import { getWorkflowByName } from '../../../../services/workflows';
import { Box, Grid } from '@mui/material';
import {
  Button,
  ComponentWithChildren,
  Editor,
  ErrorMessage,
  Skeleton,
  TextField,
} from '@palico-ai/components';
import { Background, Edge, Node, ReactFlow } from '@xyflow/react';
import { useMemo } from 'react';
import '@xyflow/react/dist/style.css';

const DefinitionContainer: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        height: '35vh',
      }}
    >
      {children}
    </Box>
  );
};

const WorkflowDefinitionView: React.FC = () => {
  const workflowName = useWorkflowName();
  const {
    data: workflowDefinition,
    isPending,
    error,
  } = useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY, workflowName],
    queryFn: async () => {
      const response = await getWorkflowByName(workflowName);
      return response;
    },
  });

  const [nodes, edges] = useMemo(() => {
    if (!workflowDefinition) {
      return [[], []];
    }
    const nodes: Node[] = workflowDefinition.graph.nodes.map((node, index) => {
      return {
        id: node.id,
        data: {
          label: node.id,
        },
        position: {
          x: 0,
          y: index * 100,
        },
      };
    });
    const edges: Edge[] = workflowDefinition.graph.edges.map((edge, index) => {
      return {
        id: index.toString(),
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
      };
    });
    return [nodes, edges];
  }, [workflowDefinition]);

  if (error) {
    return (
      <DefinitionContainer>
        <ErrorMessage message={error.message} />
      </DefinitionContainer>
    );
  }

  if (isPending || !workflowDefinition) {
    return (
      <DefinitionContainer>
        <Skeleton count={10} />
      </DefinitionContainer>
    );
  }

  return (
    <DefinitionContainer>
      <Grid
        container
        spacing={2}
        sx={{
          height: '100%',
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          <ReactFlow
            fitView
            fitViewOptions={{
              padding: 0.3,
            }}
            zoomOnScroll={false}
            zoomOnPinch={false}
            edges={edges}
            nodes={nodes}
            colorMode="dark"
          >
            <Background />
          </ReactFlow>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            boxSizing: 'border-box',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'end',
            }}
          >
            <TextField
              sx={{
                flex: 3,
              }}
              select
              label="Template"
              fullWidth
              selectOptions={[
                { label: 'Template 1', value: 'template1' },
                { label: 'Template 2', value: 'template2' },
              ]}
            />
            <Button variant="contained" color="primary" size="small">
              Execute Workflow
            </Button>
          </Box>
          <Editor
            width={'100%'}
            // height={'100%'}
            language="json"
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 16,
            }}
            value={JSON.stringify(workflowDefinition.templates, null, 2)}
          />
        </Grid>
      </Grid>
    </DefinitionContainer>
  );
};

export default WorkflowDefinitionView;
