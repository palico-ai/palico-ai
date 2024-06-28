class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getDBUrl(): string | undefined {
    const envName = this.getDBEnvName();
    return process.env[envName];
  }

  getDBEnvName(): string {
    return 'PALICO_DATABASE_URL';
  }

  getStudioDigest(): string {
    return 'sha256:1ee3eb6454f23f09923ec3331fa925c4fb52912b8c014b8da936ddf8348a7e18';
  }

  getAPIPort(): number {
    return parseInt(process.env['API_PORT'] || '8000');
  }
}

const config = new Config();

export default config;
