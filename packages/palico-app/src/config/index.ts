class Config {
  async getTraceBasePreviewURL(): Promise<string | undefined> {
    return process.env['TRACE_PREVIEW_URL_PREFIX'];
  }

  getSQLDatabaseURL(): string | undefined{
    return process.env['DB_URL'];
  }
}

const config = new Config();

export default config;