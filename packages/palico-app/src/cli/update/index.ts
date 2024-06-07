import { Command } from 'commander';
import { ApplyDBMigraiton } from '../../utils/scripts';

const UpdateCommand = new Command('update');

UpdateCommand.command('db')
  .description('Updates Palico Database')
  .action(ApplyDBMigraiton);

export default UpdateCommand;
