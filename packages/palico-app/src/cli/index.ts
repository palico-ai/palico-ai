#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateJWTToken } from './generate/generate_token';
import UpdateCommand from './update';
import { BootstrapProject, ShowStatus, StartPalicoApp } from './__root__';
import GenerateCommand from './generate';

const root = new Command();

root
  .command('generate-service-key')
  .description('Generated service key for API Requests')
  .action(GenerateJWTToken);

root
  .command('start')
  .description('Starts the Palico App')
  .action(StartPalicoApp);

root
  .command('bootstrap')
  .description('Provision all services needed to run Palico App')
  .action(BootstrapProject);

root
  .command('show')
  .description('Show status of the Palico App')
  .action(ShowStatus);

root.addCommand(UpdateCommand);

root.addCommand(GenerateCommand);

root.parse();
