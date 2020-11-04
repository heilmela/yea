import express from 'express';
import config from './config/index.config';
import logger from './system/logger';
import loader from './system/init/index.init';

const app = express();
async function start() {
  logger.info(`Started in ${process.env.NODE_ENV}`);
  await loader({ app: app });
  app.listen(config.app.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    app.emit('serverStarted');
    logger.info(`
      ################################################
         Server started on port: http://${config.app.host}:${
      config.app.port
    }/${config.app.prefix ? config.app.prefix : ''}
      ################################################
    `);
  });
}
start();
export default app;
