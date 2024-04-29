'use client';

import { Button, Paper } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import React from 'react';
import TestCaseAndResultRow from './table_row';
import ExperimentCell, { ExperimentParams } from './experiment_cell';

interface TableHeaderProps {
  features: ExperimentParams[];
  agentIdList: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ features, agentIdList }) => {
  return (
    <thead>
      <tr style={{
        height: "1px"
      }}>
        <td style={{
          height: "inherit"
        }}>
          <Paper
            sx={{
              p: 1,
              boxSizing: 'border-box',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="outlined"
              color="info"
              fullWidth
            >
              New Experiment
            </Button>
            <Button variant="outlined" color="info" fullWidth>
              Run All
            </Button>
            {/* <Box sx={{ flex: 1 }} /> */}
            <Button variant="outlined" color="info" fullWidth>
              New Test Case
            </Button>
          </Paper>
        </td>
        {features.map((feature, key) => (
          <ExperimentCell
            key={key}
            label={feature.label}
            agentId={feature.agentId}
            agentIdList={agentIdList}
          />
        ))}
      </tr>
    </thead>
  );
};

const agentIDList = ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4', 'Agent 5'];

const AgentFeatureTestGrid: React.FC = () => {
  const [experiments, setExperiments] = React.useState<ExperimentParams[]>([
    { label: 'Feature 1', agentId: 'Agent 1' },
    { label: 'Feature 2', agentId: 'Agent 2' },
    { label: 'Feature 3', agentId: 'Agent 3' },
    { label: 'Feature 4', agentId: 'Agent 3' },
  ]);
  const [testCases, setTestCases] = React.useState<string[]>([
    'Test Case 1',
    'Test Case 2',
    'Test Case 3',
  ]);
  return (
    <table
      style={{
        borderSpacing: '12px',
      }}
    >
      <TableHeader features={experiments} agentIdList={agentIDList} />
      <tbody>
        {testCases.map((testCase, key) => (
          <TestCaseAndResultRow
            key={key}
            featureCount={experiments.length}
            testCase={testCase}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AgentFeatureTestGrid;
