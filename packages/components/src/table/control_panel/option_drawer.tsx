import { Box, Drawer } from '@mui/material';
import React from 'react';

export interface OptionDrawerProps {
  button: React.ReactNode;
  children: React.ReactNode;
}

export const OptionPanel: React.FC<OptionDrawerProps> = ({
  button,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick={() => setOpen(true)}
      >
        {button}
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <Box
          sx={{
            width: 220,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {children}
        </Box>
      </Drawer>
    </Box>
  );
};
