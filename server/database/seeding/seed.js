import mysqlImport from 'mysql-import';
import logger from 'src/utils/logger';
import migrationConfig from 'src/config/migration';

mysqlImport.config({
  ...migrationConfig,
  onerror: err => logger.error(err.message)
}).import('server/database/seeding/seed.sql').then(() => {
  logger.info('seeding complete');
});
