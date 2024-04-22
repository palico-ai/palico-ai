class Config {
  public readonly ProjectConfigFileName = 'palico.json'
  public readonly TempDirectory = 'palico.out'
  public readonly BundleFileKey = 'bundle.zip'
  public readonly ClientAPIURL = 'https://l6rngzgmaf.execute-api.us-east-1.amazonaws.com/prod'
}

const config = new Config()

export default config
