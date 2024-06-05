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
      embedURL="https://www.loom.com/embed/72d981d967e140c2a8023afd1a21e73f?sid=6102aecf-be83-4e23-bed9-4f57f560c21f"
    />
  );
};

export default DebugAndTrace;
