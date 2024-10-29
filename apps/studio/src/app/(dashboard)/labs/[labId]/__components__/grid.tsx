'use client';

import { Button, Paper } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid
import React, { useContext } from 'react';
import TestCaseAndResultRow from './table_row';
import ExperimentCell from './experiment_cell';
import { LabCanvasContext } from './canvas.context';

const TableHeader: React.FC = () => {
  const {
    experiments,
    agentIdList,
    addExperiment,
    addTestCase,
    runAllExperiments,
  } = useContext(LabCanvasContext);

  const handleClickAddNewExperiment = () => {
    addExperiment({
      agentId: agentIdList[0],
      label: 'New Experiment',
    });
  };

  const handleClickAddNewTestCase = () => {
    addTestCase({
      label: 'New Test Case',
      userMessage: '',
    });
  };

  return (
    <thead>
      <tr
        style={{
          height: '1px',
        }}
      >
        <td
          style={{
            height: 'inherit',
          }}
        >
          <Paper
            sx={{
              p: 1,
              gap: 2,
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
              onClick={handleClickAddNewExperiment}
            >
              New Experiment
            </Button>
            {experiments.length !== 0 && (
              <Button
                variant="outlined"
                color="info"
                fullWidth
                onClick={runAllExperiments}
              >
                Run All
              </Button>
            )}
            {/* <Box sx={{ flex: 1 }} /> */}
            <Button
              variant="outlined"
              color="info"
              fullWidth
              onClick={handleClickAddNewTestCase}
            >
              New Test Case
            </Button>
          </Paper>
        </td>
        {experiments.map((exp, key) => (
          <ExperimentCell
            key={key}
            experimentId={exp.id}
            agentIdList={agentIdList}
          />
        ))}
      </tr>
    </thead>
  );
};

const AgentFeatureTestGrid: React.FC = () => {
  const { experiments, testCases } = useContext(LabCanvasContext);
  return (
    <table
      style={{
        borderSpacing: '12px',
      }}
    >
      <TableHeader />
      <tbody>
        {testCases.map((testCase, key) => (
          <TestCaseAndResultRow
            key={key}
            experimentIds={experiments.map((exp) => exp.id)}
            testCase={testCase}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AgentFeatureTestGrid;
