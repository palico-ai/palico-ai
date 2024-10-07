'use client';

import { Box, Paper } from '@mui/material';
import Image, { ImageProps } from 'next/image';
import React from 'react';

export interface ControlPanelCardProps {
  title: string;
  image: ImageProps['src'];
}

const ControlPanelCard: React.FC<ControlPanelCardProps> = ({
  title,
  image,
}) => {
  return (
    <Box>
      {/* <Typography mb={2} variant="h5">
        {title}
      </Typography> */}
      <Paper sx={{ p: 1 }} elevation={1}>
        <Image
          src={image}
          alt={title}
          height={747}
          width={1120}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </Paper>
    </Box>
  );
};

export default ControlPanelCard;
