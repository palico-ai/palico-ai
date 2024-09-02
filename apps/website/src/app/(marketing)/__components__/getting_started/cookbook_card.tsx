import { Divider } from '@mui/material';
import {
  Button,
  Card,
  CardContent,
  CardActions,
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
        }}
      >
        <CardHeader title={<Typography variant="h5">{title}</Typography>} />
        <CardContent>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
            }}
          >
            {description}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button size="small" variant="text">
            Read
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
};

export default CookbookCard;
