import { Editor } from '@monaco-editor/react';
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { MenuButton } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';

export type ExperimentParams = {
  label: string;
  agentId: string;
};

export interface ExperimentConfigProps extends ExperimentParams {
  agentIdList: string[];
}

const HEIGHT = '175px';
const WIDTH = '400px';

interface CellHeaderProps {
  agentIdList: string[];
  label: string;
  agentId: string;
}

const CellHeader: React.FC<CellHeaderProps> = ({
  agentIdList,
  agentId,
  label,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // gap: 1,
      }}
    >
      <TextField
        sx={{
          minWidth: "100px",
          marginLeft: 0,
          marginRight: 1,
        }}
        select
        size="small"
        variant="outlined"
        defaultValue={agentId}
      >
        {agentIdList.map((agentId, key) => (
          <MenuItem key={key} value={agentId}>
            {agentId}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        defaultValue={label}
        placeholder="Feature Name"
        variant="standard"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton size="small" color="success">
              <RunIcon />
            </IconButton>
          ),
        }}
      />
      <MenuButton
        menuItems={[
          {
            label: 'Delete',
            onClick: () => {
              console.log('Selected Delete');
            },
          }
        ]}
        icon={<OptionMenuIcon />}
      />
    </Box>
  );
};

const ExperimentCell: React.FC<ExperimentConfigProps> = ({
  agentIdList,
  label,
  agentId,
}) => {
  return (
    <th
      scope="col"
      style={{
        minWidth: WIDTH,
        maxWidth: WIDTH,
      }}
    >
      <Paper sx={{ p: 1 }}>
        <CellHeader label={label} agentIdList={agentIdList} agentId={agentId} />
        <Divider
          sx={{
            mb: 1,
          }}
        >
          <Typography variant="caption" color="textSecondary">
            FeatureFlag JSON
          </Typography>
        </Divider>
        <Box>
          {/* TODO: Add tabs between cotnext and user message */}
          <Editor
            theme="vs-dark"
            height={HEIGHT}
            defaultLanguage="json"
            options={{
              ariaLabel: 'User Message',
              scrollBeyondLastColumn: 0,
            }}
            defaultValue={`{\n  "key": "value"\n}`}
          />
        </Box>
      </Paper>
    </th>
  );
};

export default ExperimentCell;
