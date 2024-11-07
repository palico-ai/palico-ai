/**
 * Represents an Object that can be converted to JSON
 */
export type JSONAbleObject<
  T extends Record<string, any> = Record<string, any>
> = T;

export enum JobQueueStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  FAILED = 'failed',
  SUCCESS = 'success',
}
