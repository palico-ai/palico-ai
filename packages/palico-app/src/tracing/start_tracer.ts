import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { PalicoSpanExporter } from './exporter';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'palico-agents',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0',
  }),
  // traceExporter: new OTLPTraceExporter({}),
  traceExporter: new PalicoSpanExporter(),
});

console.log('Starting tracing...');
sdk.start();
