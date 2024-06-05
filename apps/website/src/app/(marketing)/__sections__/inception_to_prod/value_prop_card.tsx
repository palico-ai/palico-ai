import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

interface ValuePropCardProps {
  label: string;
  children: React.ReactNode;
}

const SimpleValuePropCard: React.FC<ValuePropCardProps> = ({
  label,
  children,
}) => {
  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Grid
          container
          sx={{
            alignItems: 'center',
          }}
          spacing={4}
        >
          <Grid item xs={12} md={4}>
            <Typography variant="h4" fontWeight={'regular'}>
              {label}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {children}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SimpleValuePropCard;
