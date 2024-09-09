import { ENVName, getEnvOrThrow } from '../utils/environment';

class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    return process.env[ENVName.DATABASE_URL];
  }

  getStudioDigest(): string {
    return 'sha256:a083cc09b243a87ae3bd3fa525969eb5f1f4b52108fa6d3948b741555afba7ca';
  }

  getAPIPort(): number {
    return parseInt(getEnvOrThrow(ENVName.PUBLIC_API_PORT));
  }
}

const config = new Config();

export default config;
