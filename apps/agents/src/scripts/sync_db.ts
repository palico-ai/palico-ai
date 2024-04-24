import { sequelize } from '../services/sequelize';

const FORCE_SYNC = process.env['FORCE_SYNC'] === 'true';

sequelize
  .sync({ force: FORCE_SYNC })
  .then(() => {
    console.log('Database synced');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
    process.exit(1);
  });
