import * as chalk from 'chalk';
import { PackageJSONSchema } from './package_json';

export const StarterPackageJSONSchema: PackageJSONSchema = {
  name: 'starter-app-template',
  version: '1.0.0',
  description: '',
  main: 'index.js',
  scripts: {
    palico: 'palico-app',
    start: 'palico-app start',
    reinstall: 'npm remove @palico-ai/app && npm install @palico-ai/app',
  },
  nodemonConfig: {
    ignore: ['appdata/**/*'],
  },
  dependencies: {
    '@opentelemetry/api': '^1.8.0',
    '@opentelemetry/auto-instrumentations-node': '^0.44.0',
    '@opentelemetry/exporter-zipkin': '^1.24.0',
    '@opentelemetry/sdk-metrics': '^1.24.0',
    '@opentelemetry/sdk-node': '^0.51.0',
    '@opentelemetry/sdk-trace-node': '^1.24.0',
    openai: '^4.52.0',
  },
  devDependencies: {
    '@types/nodemon': '^1.19.6',
    nodemon: '^3.1.0',
  },
};

export const StarterTemplateNextSteps = (projectName: string) => [
  `Navigate to the project directory: ${chalk.greenBright(
    `cd ${projectName}`
  )}`,
  `Update ${chalk.greenBright('.env')} with your OpenAI API key and model`,
  `Run ${chalk.greenBright('npm start')} to start the application`,
];
