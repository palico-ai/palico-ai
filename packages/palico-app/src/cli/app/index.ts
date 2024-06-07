import { Command } from 'commander';
import { StartPalicoApp } from './start';

const AppCommand = new Command('app');

AppCommand.command('start')
  .description('Starts the Palico App')
  .action(StartPalicoApp);

export default AppCommand;
