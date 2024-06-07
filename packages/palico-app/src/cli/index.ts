#!/usr/bin/env node

import { Command } from 'commander';
import { GenerateJWTToken } from './generate_token';
import ExpCommand from './exp';
import UpdateCommand from './update';
import AppCommand from './app';

const root = new Command();

root
  .command('generate-service-key')
  .description('Generated service key for API Requests')
  .action(GenerateJWTToken);

root.addCommand(ExpCommand);

root.addCommand(UpdateCommand);

root.addCommand(AppCommand);

root.parse();
