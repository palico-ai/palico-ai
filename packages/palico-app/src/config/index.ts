import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.PALICO_API_DATABASE_URL];
  }

  getStudioDockerImage(): string {
    return 'palicoai/studio:main@sha256:b8a3d1e5816654242cfcaa7840f0dd826925d90c8190e902f134a4bf6d1c5acf';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PALICO_API_PORT));
  }
}

const config = new Config();

export default config;
