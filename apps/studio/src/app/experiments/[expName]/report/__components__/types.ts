import { DatasetMetadata, Evaluation } from '@palico-ai/common';

export interface Dataset extends DatasetMetadata {
  data: Omit<Evaluation, 'experimentName' | 'evalName'>;
}
