import { scopePerRequest, loadControllers } from 'awilix-express';
import logger from '../logger';
import cors from 'cors';
import config from '../../config/index.config';
import { Lifetime } from 'awilix';
import bodyParser from 'body-parser';

export default ({ app, container }) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.get('/available', (req, res) => {
    res.status(200).end();
  });

  app.use((req, res, next) => {
    logger.debug(req.path);
    next();
  });
  app.use(scopePerRequest(container));
  const subroutes = loadControllers('../routes/**/*.subroute.js', {
    cwd: __dirname,
    lifetime: Lifetime.SINGLETON,
  });
  const routes = loadControllers('../routes/**/*.route.js', {
    cwd: __dirname,
    lifetime: Lifetime.SINGLETON,
  });
  if (config.app.prefix) {
    logger.debug(`API available on prefix ${config.app.prefix}`);
    app.use(`/${config.app.prefix}/`, [subroutes, routes]);
  } else {
    logger.debug(`API avaiable on /`);
    app.use([subroutes, routes]);
  }
  app.use(container.resolve('validationError'));
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send('Internal Server Error');
  });
};
