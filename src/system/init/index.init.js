import expressLoader from './express.init';
import dependencyLoader from './dependency.init';
import databaseLoader from './database.init';
import logger from '../logger';

export default async ({ app }) => {
  const db = await databaseLoader();
  const container = await dependencyLoader({
    logger: logger,
  });
  await expressLoader({ app: app, container: container });
  logger.info('Loading complete.');
};
