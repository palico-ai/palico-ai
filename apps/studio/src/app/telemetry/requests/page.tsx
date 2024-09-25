import React, { Suspense } from 'react';
import RequestTelemetryApp from './app';

const RequestTelemetryPage: React.FC = () => {
  return (
    <Suspense>
      <RequestTelemetryApp />
    </Suspense>
  );
};

export default RequestTelemetryPage;
