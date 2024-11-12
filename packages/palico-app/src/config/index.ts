import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.PALICO_API_DATABASE_URL];
  }

  getStudioDockerImage(): string {
    return 'palicoai/studio:main@sha256:4c5920b1f1061a1ac5ceb75d222f114941aea5f2902d75d0d2bf4c660292268f';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PALICO_API_PORT));
  }
}

const config = new Config();

export default config;
