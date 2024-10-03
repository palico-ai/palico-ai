import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.PALICO_API_DATABASE_URL];
  }

  getStudioDockerImage(): string {
    return 'palicoai/studio:main@sha256:4511de0ec0422f22d07bc9f11dbfebce110e048782c437b68c79901043b29065';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PALICO_API_PORT));
  }
}

const config = new Config();

export default config;
