import crypto from 'crypto';

export const uuid = () => {
  return crypto.randomUUID();
};
