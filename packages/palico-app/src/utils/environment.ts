export enum ENVName {
  PALICO_API_PORT = 'PUBLIC_API_PORT', // used by Palico API Service
  PALICO_API_DATABASE_URL = 'DATABASE_URL', // used by Palico API Service
  PALICO_STUDIO_API_URL = 'PALICO_API_URL', // used by Palico Studio
  PALICO_STUDIO_API_SERVICE_KEY = 'PALICO_API_SERVICE_KEY', // used by Palico Studio
  DOCKER_PUBLIC_DATABASE_PORT = 'PUBLIC_DATABASE_PORT', // used by docker-compose
  DOCKER_PUBLIC_STUDIO_PORT = 'PUBLIC_STUDIO_PORT', // used by docker-compose
}

export const getEnvOrThrow = (name: ENVName): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
};
