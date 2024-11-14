import * as path from 'path';
import * as chalk from 'chalk';
import PackageJSON from './package_json';
import { copyDirectory, getFileNames, renameFile } from '../utils/os';
import { StarterTemplateNextSteps } from './templates';

interface Option {
  template?: string;
}

const knownTemplates = new Set(['starter']);

const copyTemplate = async (template: string, destination: string) => {
  if (!knownTemplates.has(template)) {
    throw new Error(`Unknown template: ${template}`);
  }
  const templateDirectory = path.join(
    __dirname,
    '..',
    '..',
    'templates',
    template
  );
  await copyDirectory(templateDirectory, destination);
  const allFiles = await getFileNames(destination);
  const templateFiles = allFiles.filter((file) => file.startsWith('template.'));
  await Promise.all(
    templateFiles.map((file) =>
      renameFile(destination, file, file.replace('template.', ''))
    )
  );
};

export const InitHandler = async (projectName: string, option: Option) => {
  const { template = 'starter' } = option;
  if (!projectName || projectName.length === 0) {
    throw new Error('Project name is required');
  }
  console.log(`Initializing ${projectName}...`);
  const destinationDirectory = path.join(process.cwd(), projectName);
  console.log('Copying template: ', template);
  await copyTemplate(template, destinationDirectory);
  const packageJSON = new PackageJSON(destinationDirectory);
  await packageJSON.updatePackageJSON({
    name: projectName,
  });
  console.log('Installing dependencies...');
  await packageJSON.installDependencies([{ name: '@palico-ai/app' }]);
  console.log(chalk.green('Project initialized!'));
  console.log(chalk.blue('Next Steps:'));
  StarterTemplateNextSteps(projectName).forEach((step, index) => {
    console.log(chalk.blue(`${index + 1}. ${step}`));
  });
  console.log('\nRead more at ' + chalk.blue('https://docs.palico.ai'));
};
