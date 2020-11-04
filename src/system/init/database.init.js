import mongoose from 'mongoose';
import logger from '../logger';
import config from '../../config/index.config';
import promiseRetry from 'promise-retry';
import transform from '../../models/plugins/transform.plugin';

export default async () => {
  mongoose.plugin(transform);
  const options = {
    retries: config.database.maxRetries,
    factor: 1.1,
    minTimeout: config.database.reconnectInterval,
    maxTimeout: config.database.reconnectInterval * 2,
  };
  let connection = await _connect(options);
  return connection.connection.db;
};

async function _connect(retryOptions) {
  let authSource = config.database.auth;
  let port = config.database.port;
  let connectionString = `mongodb://${config.database.host}${
    port ? `:${port}` : ''
  }/${config.database.name}`;
  connectionString += authSource ? `?authSource=${authSource}` : '';
  const options = {
    dbName: config.database.name,
    user: config.database.user,
    pass: config.database.password,
  };
  return promiseRetry((retry, number) => {
    logger.info(
      `Attempt no. ${number} connecting to: ${connectionString}`,
    );
    return mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
        keepAlive: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        keepAliveInitialDelay: config.database.reconnectInterval,
        ...options,
      })
      .catch(retry);
  }, retryOptions).catch((err) => {
    logger.error(`Failed connecting to: ${connectionString}`);
    logger.error(err);
    process.exit(1);
  });
}
