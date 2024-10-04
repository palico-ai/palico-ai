import { Command } from 'commander';

const UpdateCommand = new Command('update');

interface UpdateCommandOptions {
  dbUrl: string;
}

UpdateCommand.command('db')
  .description('Updates Palico Database')
  .option('--db-url <db-url>', 'Database URL')
  .action(async (params: UpdateCommandOptions) => {
    if (!params.dbUrl) {
      console.error('Database URL is required');
      return;
    }
    throw new Error('Not implemented');
  });

export default UpdateCommand;
