import { sequelize } from '../../storage/sql/database'

interface Options {
  forceSync?: boolean
}

export const SyncDB = async (options: Options): Promise<void> => {
  await sequelize.sync({ force: options.forceSync })
}
