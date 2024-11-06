import { Command } from 'commander';
import { GenerateJWTToken } from './generate_token';

const GenerateCommand = new Command('generate');

GenerateCommand.command('apikey')
  .option('-s, --secret <secret>', 'Secret key to use for generating the token')
  .description('Generates an API key for calling the Palico API')
  .action(GenerateJWTToken);

export default GenerateCommand;
