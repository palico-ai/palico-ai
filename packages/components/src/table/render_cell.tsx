'use client';

import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

interface ExpandableTextCellProps {
  fullContent: string;
  maxLength?: number;
}

export const ExpandableTextCell: React.FC<ExpandableTextCellProps> = ({
  maxLength = 100,
  fullContent,
}) => {
  const [expanded, setExpanded] = useState(false);

  const value = useMemo(() => {
    if (expanded) {
      return fullContent;
    }
    if (fullContent.length > maxLength) {
      return fullContent.slice(0, maxLength) + '...';
    }
    return fullContent;
  }, [expanded, fullContent, maxLength]);

  const shouldShowExpandButton = useMemo(() => {
    return fullContent.length > maxLength && !expanded;
  }, [expanded, fullContent.length, maxLength]);

  return (
    <Box>
      {value}
      {shouldShowExpandButton && (
        <button onClick={() => setExpanded(true)}>Expand</button>
      )}
    </Box>
  );
};
