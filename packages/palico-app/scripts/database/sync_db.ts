import { execSync } from 'child_process';
import { sequelize } from '../../src/services/database/tables';
import { v2 as compose } from 'docker-compose';
import chalk from 'chalk';

const logEvent = (event: string) => {
  console.log(chalk.green(event));
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleSyncDatabase = async () => {
  const forceSync = process.env['FORCE_SYNC'] === 'true';
  logEvent(`Force sync: ${forceSync}`);
  await compose.upAll({
    cwd: __dirname,
  });
  await wait(5000);
  logEvent('Syncing sequelize schema');
  await sequelize.sync({ force: false });
  logEvent('Syncing prisma schema');
  execSync('nx run palico-app:prisma:pull', {
    stdio: 'inherit',
  });
  logEvent('Adding new migrations');
  execSync('nx run palico-app:primsa:save', {
    stdio: 'inherit',
  });
  logEvent('Stopping docker-compose');
  execSync('docker-compose down', {
    cwd: __dirname,
    stdio: 'inherit',
  });
};

void handleSyncDatabase();
