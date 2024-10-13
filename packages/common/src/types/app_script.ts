import { JobQueueStatus } from './common';
import { JSONAbleObject } from './common';

export interface AppScriptTemplate<P extends JSONAbleObject> {
  name: string;
  params: P;
}

export interface AppScriptRequest {
  requestId: string;
  scriptName: string;
  input: JSONAbleObject;
  status: JobQueueStatus;
  createdAt: string;
  updatedAt: string;
}
