import { Command } from 'commander';
import {
  ApplyDBMigrationsCommandHandler,
  InitSelfHostCommandHandler,
  UpdatePalicoContainerImages,
} from './handlers';

const SelfhostCommand = new Command('selfhost');

SelfhostCommand.command('init').action(InitSelfHostCommandHandler);

SelfhostCommand.command('migrate-db')
  .description('Apply the database migrations')
  .requiredOption('--user <user>', 'Database Username')
  .requiredOption('--password <password>', 'Database Password')
  .option('--db <name>', 'Database Name', 'palicoapp')
  .option('--host <host>', 'Database Host Address', 'localhost')
  .option('--port <port>', 'Database Port', '5432')
  .action(ApplyDBMigrationsCommandHandler);

SelfhostCommand.command('update-compose').action(UpdatePalicoContainerImages);

export default SelfhostCommand;
