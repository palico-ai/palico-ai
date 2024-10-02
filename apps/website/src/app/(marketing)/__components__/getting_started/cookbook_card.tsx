import { Divider } from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  Link,
  Typography,
} from '@palico-ai/components';
import React from 'react';

export interface CookbookCardProps {
  title: string;
  description: string;
  link: string;
}

const CookbookCard: React.FC<CookbookCardProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <Link href={link}>
      <Card
        elevation={1}
        sx={{
          height: '100%',
          px: 1,
          boxSizing: 'border-box',
        }}
      >
        <CardHeader title={<Typography variant="h6">{title}</Typography>} />
        <Divider />
        <CardContent>
          <Typography variant="body2" fontSize={16}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CookbookCard;
