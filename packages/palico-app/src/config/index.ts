import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.DATABASE_URL];
  }

  getStudioDigest(): string {
    return 'sha256:e51c8d26da3fbdfc73efa89b4dc1ad7a2377166a3bfc6bbacebc8deaca225729';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PUBLIC_API_PORT));
  }
}

const config = new Config();

export default config;
