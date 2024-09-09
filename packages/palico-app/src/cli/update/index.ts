import { Command } from 'commander';
import { RunMigration } from '../../utils/scripts';

const UpdateCommand = new Command('update');

UpdateCommand.command('db')
  .description('Updates Palico Database')
  .action(RunMigration);

export default UpdateCommand;
