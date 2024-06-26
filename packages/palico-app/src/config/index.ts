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
    return 'sha256:bdd24a7657b8c45627cc1770501be89b96cfd0b387df3b053a9e8f30041eba18';
  }

  getAPIPort(): number {
    return parseInt(process.env['API_PORT'] || '8000');
  }
}

const config = new Config();

export default config;
