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
    return 'sha256:3b495e87152ebceb83633a7114f2cdfedb47250dd77c9a343ff9b2084e106acf';
  }

  getAPIPort(): number {
    return parseInt(process.env['API_PORT'] || '8000');
  }
}

const config = new Config();

export default config;
