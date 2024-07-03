import React from 'react';
import {
  Box,
  Skeleton as MUISkeleton,
  SkeletonProps as MUISkeletonProps,
} from '@mui/material';

interface SkeletonProps {
  count?: number;
  width?: number | string;
  height?: number | string;
  variant?: MUISkeletonProps['variant'];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  width = '100%',
  height = '100%',
  variant = 'rounded',
}) => {
  if (count === 1) {
    return <MUISkeleton variant={variant} width={width} height={height} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        height: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <MUISkeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
        />
      ))}
    </Box>
  );
};
