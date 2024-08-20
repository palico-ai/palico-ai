import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Editor, MenuButton } from '@palico-ai/components';
import OptionMenuIcon from '@mui/icons-material/MoreVert';
import RunIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useExperiment } from './hooks';
import LabItemViewConfig from './constants';
import StarIcon from '@mui/icons-material/Star';

export interface ExperimentCellProps {
  agentIdList: string[];
  experimentId: string;
}

const HEIGHT = '175px';
const WIDTH = LabItemViewConfig.EXPERIMENT_CELL_WIDTH;

interface CellHeaderProps {
  isBaseline: boolean;
  agentIdList: string[];
  label: string;
  agentId: string;
  onClickSetBaseline: () => void;
  onClickRun: () => void;
  onClickDelete: () => void;
  onChangeLabel: (label: string) => void;
  onChangeAgentId: (agentId: string) => void;
}

const CellHeader: React.FC<CellHeaderProps> = ({
  agentIdList,
  isBaseline,
  agentId,
  label,
  onClickSetBaseline,
  onChangeLabel,
  onClickRun,
  onClickDelete,
  onChangeAgentId,
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
          minWidth: '100px',
          marginLeft: 0,
          marginRight: 1,
        }}
        select
        size="small"
        variant="outlined"
        value={agentId}
        onChange={(e) => onChangeAgentId(e.target.value)}
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
        onChange={(e) => onChangeLabel(e.target.value)}
        placeholder="Feature Name"
        variant="standard"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton size="small" color="success" onClick={onClickRun}>
              <RunIcon />
            </IconButton>
          ),
        }}
      />
      <Tooltip title="Set as baseline">
        <IconButton
          size="small"
          color={isBaseline ? 'primary' : 'default'}
          onClick={onClickSetBaseline}
        >
          <StarIcon />
        </IconButton>
      </Tooltip>
      <MenuButton
        menuItems={[
          {
            label: 'Delete',
            onClick: () => {
              onClickDelete();
            },
          },
        ]}
        icon={<OptionMenuIcon />}
      />
    </Box>
  );
};

const ExperimentCell: React.FC<ExperimentCellProps> = ({
  agentIdList,
  experimentId,
}) => {
  const {
    experiment,
    baselineExperimentId,
    setBaselineExperimentId,
    runTests,
    handleChangeExperimentLabel,
    handleChangeExperimentAgent,
    handleRemoveExperiment,
    handleChangeExperimentAppConfig,
  } = useExperiment(experimentId);

  if (!experiment) {
    throw new Error('Experiment not found');
  }

  return (
    <th
      scope="col"
      style={{
        minWidth: WIDTH,
        maxWidth: WIDTH,
      }}
    >
      <Paper sx={{ p: 1 }}>
        <CellHeader
          isBaseline={baselineExperimentId === experimentId}
          onClickSetBaseline={() => {
            if (baselineExperimentId === experimentId) {
              setBaselineExperimentId();
            } else {
              setBaselineExperimentId(experimentId);
            }
          }}
          onChangeLabel={handleChangeExperimentLabel}
          onChangeAgentId={handleChangeExperimentAgent}
          label={experiment.label}
          agentIdList={agentIdList}
          agentId={experiment.agentId}
          onClickDelete={handleRemoveExperiment}
          onClickRun={runTests}
        />
        <Divider
          sx={{
            mb: 1,
          }}
        >
          <Typography variant="caption" color="textSecondary">
            AppConfig JSON
          </Typography>
        </Divider>
        <Box>
          {/* TODO: Add tabs between cotnext and user message */}
          <Editor
            height={HEIGHT}
            value={experiment.appConfigJSON}
            onChange={(value) => handleChangeExperimentAppConfig(value)}
            defaultLanguage="json"
            options={{
              ariaLabel: 'User Message',
              scrollBeyondLastColumn: 0,
            }}
          />
        </Box>
      </Paper>
    </th>
  );
};

export default ExperimentCell;
