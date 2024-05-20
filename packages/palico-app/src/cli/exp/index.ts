import { Command } from 'commander'
import {GenerateNewExperiment} from './handlers'

const ExpCommand = new Command("exp");

ExpCommand
  .command('new <name>')
  .description('Create a new experiment')
  .action(GenerateNewExperiment);

export default ExpCommand