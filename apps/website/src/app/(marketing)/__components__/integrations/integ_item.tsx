'use client';

import { Divider, Paper } from '@mui/material';
import { Link, Typography } from '@palico-ai/components';
import Image, { ImageProps } from 'next/image';

export interface LibraryItemProps {
  title: string;
  image: ImageProps['src'];
  link: string;
}

const LibraryItem: React.FC<LibraryItemProps> = ({ title, image, link }) => {
  return (
    <Link href={link} target="_blank">
      <Paper
        elevation={2}
        sx={(theme) => ({
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          borderRadius: 4,
          // overflow: 'hidden',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        })}
      >
        <Image
          style={{
            width: '100%',
            height: '70px',
            // height: '80px',
            objectFit: 'contain',
          }}
          src={image}
          alt={title}
          width={420}
          height={240}
        />
        <Divider />
        <Typography
          variant="caption"
          fontSize={16}
          textTransform={'uppercase'}
          textAlign={'center'}
          gutterBottom
        >
          {title}
        </Typography>
      </Paper>
    </Link>
  );
};

export default LibraryItem;
