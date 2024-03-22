#!/usr/bin/env node

import { Command } from 'commander';
import { InitHandler } from './init';

const root = new Command();

root
  .command('init')
  .description('Initializes a project')
  .argument('<projectName>', 'Name of the project')
  .option('-t, --template <template>', 'Template to use')
  .action(InitHandler);

root.parse();
