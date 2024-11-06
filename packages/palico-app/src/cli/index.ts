#!/usr/bin/env node

import { Command } from 'commander';
import UpdateCommand from './update';
import { StartDevApp, StartProdApp } from './__root__';
import GenerateCommand from './generate';
import SelfhostCommand from './selfhost';

const root = new Command();

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

root.addCommand(UpdateCommand);

root.addCommand(GenerateCommand);

root.parse();
