import * as chalk from 'chalk';

export const StarterTemplateNextSteps = (projectName: string) => [
  `Navigate to the project directory: ${chalk.greenBright(
    `cd ${projectName}`
  )}`,
  `Update ${chalk.greenBright('.env')} with your OpenAI API key`,
  `Run ${chalk.greenBright('npm start')} to start the application`,
];
