import React from 'react';
import TestCaseCell from './test_case_cell';
import ResultCell from './result_cell';
import { LabTestCaseModel } from '@palico-ai/common';

interface TestCaseAndResultRow {
  experimentIds: string[];
  testCase: LabTestCaseModel;
}

const TestCaseAndResultRow: React.FC<TestCaseAndResultRow> = ({
  experimentIds,
  testCase,
}) => {
  return (
    <tr style={{height: "1px"}}>
      <TestCaseCell testCaseId={testCase.id} />
      {experimentIds.map((experimentId) => (
        <ResultCell key={experimentId} experimentId={experimentId} testId={testCase.id} />
      ))}
    </tr>
  );
};

export default TestCaseAndResultRow;
