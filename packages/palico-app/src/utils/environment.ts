export enum ENVName {
  DATABASE_URL = 'DATABASE_URL',
  TRACE_PREVIEW_URL_PREFIX = 'TRACE_PREVIEW_URL_PREFIX',
  PUBLIC_API_PORT = 'API_PORT',
  PUBLIC_DATABASE_PORT = 'PUBLIC_DATABASE_PORT',
  PUBLIC_STUDIO_PORT = 'PUBLIC_STUDIO_PORT',
}

export const getEnvOrThrow = (name: ENVName): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};
