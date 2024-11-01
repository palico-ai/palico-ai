import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.PALICO_API_DATABASE_URL];
  }

  getStudioDockerImage(): string {
    return 'palicoai/studio:main@sha256:06eb67a29c0c98faa3d6fba2cd3040c4dbb3636913f224937b3ee2c6ab88cd78';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PALICO_API_PORT));
  }
}

const config = new Config();

export default config;
