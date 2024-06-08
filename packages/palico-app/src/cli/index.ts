#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateJWTToken } from './generate_token';
import ExpCommand from './exp';
import UpdateCommand from './update';
import { StartPalicoApp } from './__root__/start';

const root = new Command();

root
  .command('generate-service-key')
  .description('Generated service key for API Requests')
  .action(GenerateJWTToken);

root
  .command('start')
  .description('Starts the Palico App')
  .option('--no-studio', 'Start the app without the studio')
  .action(StartPalicoApp);

root.addCommand(ExpCommand);

root.addCommand(UpdateCommand);

root.parse();
