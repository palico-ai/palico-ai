import React from 'react';
import HowItWorksStep from './side_by_side_layout';

const DebugAndTrace: React.FC = () => {
  return (
    <HowItWorksStep
      disableGutter
      maxHeight={300}
      title="Root Cause Accuracy Issues"
      descriptions={[
        'Step through your agent’s runtime execution with our out-of-the-box traces',
        'Easily add your own traces with OpenTelemetry standards',
        'Sync your traces to your favorite observability tools like Datadog, New Relic, and more',
      ]}
      embedURL="https://www.loom.com/embed/afb70c07bcc24f46a12a756dd80de29a?sid=d3e3a2c9-3ebb-4a73-8538-6d0406dd726e"
    />
  );
};

export default DebugAndTrace;
