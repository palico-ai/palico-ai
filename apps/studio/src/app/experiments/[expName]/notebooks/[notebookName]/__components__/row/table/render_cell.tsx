import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button, SyntaxHighlighter, Typography } from '@palico-ai/components';

const MAX_LENGTH = 40;

interface RenderAnalysisTableCellProps {
  value?: string;
  isCode?: boolean;
}

export const RenderAnalysisTableCell: React.FC<
  RenderAnalysisTableCellProps
> = ({ value = '', isCode }) => {
  const [expandRow, setExpandRow] = useState(false);

  const showExpandButton = useMemo(() => {
    return value.length > MAX_LENGTH;
  }, [value]);

  const displayValue = () => {
    const val = expandRow
      ? value
      : value.length > MAX_LENGTH
      ? value.slice(0, MAX_LENGTH) + '...'
      : value;

    if (isCode) {
      return (
        <SyntaxHighlighter
          language="json"
          wrapLines={true}
          wrapLongLines={true}
        >
          {val}
        </SyntaxHighlighter>
      );
    }

    return (
      <Typography
        noWrap={!expandRow}
        whiteSpace={expandRow ? 'pre-wrap' : 'nowrap'}
      >
        {val}
      </Typography>
    );
  };

  if (!value) {
    return <Box />;
  }

  return (
    <Box>
      {value.length > MAX_LENGTH && !expandRow ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: isCode ? 'column' : 'row',
            gap: 1,
          }}
        >
          {displayValue()}
          {showExpandButton && (
            <Typography
              display={'block'}
              noWrap
              onClick={() => setExpandRow(true)}
              sx={{
                color: 'info.main',
                cursor: 'pointer',
              }}
            >
              Show more
            </Typography>
          )}
        </Box>
      ) : (
        value && (
          <Box>
            {displayValue()}
            {showExpandButton && (
              <Button
                fullWidth
                sx={{
                  color: 'info.main',
                }}
                onClick={() => setExpandRow(false)}
                variant="text"
              >
                Show less
              </Button>
            )}
          </Box>
        )
      )}
    </Box>
  );
};
