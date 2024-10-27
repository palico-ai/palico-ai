#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateJWTToken } from './generate/generate_token';
import UpdateCommand from './update';
import { StartDevApp, StartProdApp } from './__root__';
import GenerateCommand from './generate';
import SelfhostCommand from './selfhost';

const root = new Command();

root
  .command('generate-service-key')
  .description('Generated service key for API Requests')
  .action(GenerateJWTToken);

root
  .command('start')
  .description('Starts the Palico App')
  .option('--clean', 'Starts the app in clean mode')
  .action(StartDevApp);

root
  .command('start-prod')
  .description('Starts the Palico App in production mode')
  .action(StartProdApp);

root.addCommand(SelfhostCommand);

// TODO: Delete
root.addCommand(UpdateCommand);
// TODO: Delete
root.addCommand(GenerateCommand);

root.parse();
