import React, { useEffect, useMemo } from 'react';
import { RequestSpanTreeNode } from '../../types';
import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Editor,
  ErrorMessage,
  Skeleton,
  Typography,
} from '@palico-ai/components';
import { useQuery } from '@tanstack/react-query';
import { REQUEST_SPANS } from '../../../../../../constants/query_keys';
import { getRequestSpans } from '../../../../../../services/telemetry';
import { createSpanTree } from '../../utils';

const tryToParseJson = (jsonString: unknown) => {
  try {
    return JSON.parse(jsonString as string);
  } catch (e) {
    return null;
  }
};

const SpanItemDetail: React.FC<RequestSpanTreeNode> = ({ attributes }) => {
  const sanitizedAttributes = useMemo(() => {
    const sanitized: Record<string, unknown> = {};
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('palico.')) {
        return;
      }
      sanitized[key] = tryToParseJson(value) ?? value;
    });
    return sanitized;
  }, [attributes]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Attributes
      </Typography>
      <Editor
        autoReizeMaxHeight={500}
        options={{
          readOnly: true,
          wordWrap: 'on',
          minimap: { enabled: false },
        }}
        language="json"
        value={JSON.stringify(sanitizedAttributes, null, 2)}
      />
    </Paper>
  );
};

interface RequestSpanListProps {
  rootSpans: RequestSpanTreeNode[];
  onSpanSelect: (span: RequestSpanTreeNode) => void;
  selectedSpan?: RequestSpanTreeNode;
}

const RequestSpanList: React.FC<RequestSpanListProps> = ({
  rootSpans: spans,
  onSpanSelect,
  selectedSpan,
}) => {
  return (
    <List component={'div'} disablePadding>
      {spans.map((span, index) => (
        <>
          <ListItemButton
            sx={{
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
            key={span.spanId}
            selected={selectedSpan?.spanId === span.spanId}
            onClick={() => onSpanSelect(span)}
          >
            <ListItemText
              primary={
                <Box>
                  <Typography variant="body1">{span.name}</Typography>
                  <Typography variant="caption" textAlign={'right'}>
                    {span.duration}ms
                  </Typography>
                </Box>
              }
            />
          </ListItemButton>
          {span.children.length > 0 && (
            <Box
              component={'li'}
              sx={{
                pl: 2,
                borderLeft: '1px solid',
                borderColor: 'divider',
              }}
            >
              <RequestSpanList
                rootSpans={span.children}
                onSpanSelect={onSpanSelect}
                selectedSpan={selectedSpan}
              />
            </Box>
          )}
        </>
      ))}
    </List>
  );
};

export interface SpanViewProps {
  requestId: string;
}

export const SpanView: React.FC<SpanViewProps> = ({ requestId }) => {
  const [selectedSpan, setSelectedSpan] = React.useState<RequestSpanTreeNode>();

  const {
    data: requestSpans,
    isPending: isRequestSpansPending,
    error: requestSpansError,
  } = useQuery({
    queryKey: [REQUEST_SPANS, requestId],
    queryFn: async () => {
      const response = await getRequestSpans(requestId);
      return response;
    },
  });

  useEffect(() => {
    setSelectedSpan(undefined);
  }, [requestId]);

  const spanTree = useMemo(() => {
    if (!requestSpans) {
      return;
    }
    return createSpanTree(requestSpans);
  }, [requestSpans]);

  if (isRequestSpansPending || !spanTree) {
    return (
      <Box
        sx={{
          height: '30%',
          padding: 2,
        }}
      >
        <Skeleton count={5} variant="rounded" height={40} />
      </Box>
    );
  }

  if (requestSpansError) {
    console.log('Failed to fetch request spans', requestSpansError);
    return (
      <ErrorMessage centerInContainer message="Failed to fetch request spans" />
    );
  }

  const handleSpanSelect = (span: RequestSpanTreeNode) => {
    setSelectedSpan(span);
    console.log('Selected span', span);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={selectedSpan ? 4 : 12}>
        <RequestSpanList
          rootSpans={spanTree}
          onSpanSelect={handleSpanSelect}
          selectedSpan={selectedSpan}
        />
      </Grid>
      <Grid item xs={selectedSpan ? 8 : 0}>
        {selectedSpan && <SpanItemDetail {...selectedSpan} />}
      </Grid>
    </Grid>
  );
};

export default SpanView;
