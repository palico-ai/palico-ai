import { Editor } from '@monaco-editor/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

const AdvanceOption: React.FC = () => {
  return (
    <Card
      sx={{
        mt: 1,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" color={'textSecondary'}>
            Request Context
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            flex={1}
            direction="row"
            spacing={1}
            alignItems={"flex-end"}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <TextField
              sx={{
                minWidth: 200,
              }}
              fullWidth
              size='small'
              variant="standard"
              select
              label="Select Template"
            />
            <Button
              fullWidth
              color="info"
              variant="contained"
            >
              Update
            </Button>
            <Button
              fullWidth
              color="info"
              variant="contained"
            >
              Save as
            </Button>
            <Button
              fullWidth
              color="warning"
              variant="contained"
            >
              Delete
            </Button>
          </Stack>
        </Box>
        <Editor
          theme="vs-dark"
          height="18vh"
          defaultLanguage="json"
          options={{
            ariaLabel: 'User Message',
            scrollBeyondLastColumn: 0,
          }}
          defaultValue={`{\n  "key": "value"\n}`}
        />
      </CardContent>
    </Card>
  );
};

export default AdvanceOption;
