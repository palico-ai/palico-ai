import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.PALICO_API_DATABASE_URL];
  }

  getStudioDockerImage(): string {
    return 'palicoai/studio:main@sha256:32f75d51527273bad7f64f1b56b261267815e46ccf2ac51025289dd249ca37a0';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PALICO_API_PORT));
  }
}

const config = new Config();

export default config;
