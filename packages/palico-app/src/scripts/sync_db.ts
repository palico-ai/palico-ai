import { sequelize } from '../services/database/tables';

const forceSync = process.env['FORCE_SYNC'] === 'true';

console.log(`Force sync: ${forceSync}`);

sequelize.sync({ force: forceSync }).then(() => {
  console.log('Database synchronized');
});
