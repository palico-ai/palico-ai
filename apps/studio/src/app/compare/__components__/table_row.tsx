import React from 'react';
import TestCaseCell from './test_case_cell';
import ResultCell from './result_cell';

interface TestCaseAndResultRow {
  featureCount: number;
  testCase: string;
}

const TestCaseAndResultRow: React.FC<TestCaseAndResultRow> = ({
  featureCount: agentCount,
  testCase,
}) => {
  return (
    <tr style={{height: "1px"}}>
      <TestCaseCell label={testCase} />
      {Array.from({ length: agentCount }).map((_, index) => (
        <ResultCell key={index} result='Pass' />
      ))}
    </tr>
  );
};

export default TestCaseAndResultRow;
