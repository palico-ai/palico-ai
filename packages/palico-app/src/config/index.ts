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
    return 'sha256:e8c0f9ab8ea9c7b2350a27c3a29470c85ff7ea5fe20dae36325f5ebdc4a4fedc';
  }

  getAPIPort(): number {
    return parseInt(process.env['API_PORT'] || '8000');
  }
}

const config = new Config();

export default config;
