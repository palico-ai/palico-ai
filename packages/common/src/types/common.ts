export type JSONAbleObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, any>
> = T;

export enum JobQueueStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  FAILED = 'failed',
  SUCCESS = 'success',
}
