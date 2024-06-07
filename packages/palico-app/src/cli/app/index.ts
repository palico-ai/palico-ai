import { Command } from 'commander';
import { StartPalicoApp } from './start';

const AppCommand = new Command('app');

AppCommand.command('start')
  .description('Starts the Palico App')
  .option('--no-studio', 'Start the app without the studio')
  .action(StartPalicoApp);

export default AppCommand;
