import * as path from 'path';
import * as chalk from 'chalk';
import { copyDirectory } from '../utils/copy';
import { createFile } from '../utils/create_file';
import PackageJSON, { commonPackageJSON } from './package_json';

const ENV_FILE_CONTENT = `OPENAI_API_KEY=""
JWT_SECRET="secret"
`;

interface Option {
  template?: string;
}

const knownTemplates = new Set(['base', 'lexical']);

const lexicalAdditionalDependencies = {
  'zod-to-json-schema': '^3.22.4',
};

export const InitHandler = async (projectName: string, option: Option) => {
  const { template = 'base' } = option;
  if (!knownTemplates.has(template)) {
    throw new Error(`Unknown template: ${template}`);
  }
  if (!projectName || projectName.length === 0) {
    throw new Error('Project name is required');
  }
  console.log(`Initializing ${projectName}...`);
  const templateDirectory = path.join(
    __dirname,
    '..',
    '..',
    'templates',
    template
  );
  const destinationDirectory = path.join(process.cwd(), projectName);
  await copyDirectory(templateDirectory, destinationDirectory);
  const dependencies = {
    ...commonPackageJSON.dependencies,
    ...(template === 'lexical' ? lexicalAdditionalDependencies : {}),
  };
  console.log("Setting up project's dependecies...");
  const packageJSON = await PackageJSON.init({
    directory: process.cwd(),
    projectName,
    ...commonPackageJSON,
    dependencies,
  });
  await packageJSON.installDependencies([{ name: '@palico-ai/app' }]);
  await createFile(path.join(destinationDirectory, '.env'), ENV_FILE_CONTENT);
  const nextSteps = [
    `Navigate to the project directory: ${chalk.greenBright(
      `cd ${projectName}`
    )}`,
    `Update ${chalk.greenBright('.env')} with your OpenAI API key and model`,
    `Run ${chalk.greenBright('npm start')} to start the application`,
  ];
  console.log(chalk.green('Project initialized!'));
  console.log(chalk.blue('Next Steps:'));
  nextSteps.forEach((step, index) => {
    console.log(chalk.blue(`${index + 1}. ${step}`));
  });
};
