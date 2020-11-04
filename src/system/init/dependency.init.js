import {
  asValue,
  asFunction,
  asClass,
  createContainer,
  Lifetime,
} from 'awilix';
import config from '../../config/index.config';
import jwt from 'jsonwebtoken';
import path from 'path';

export default async ({ logger }) => {
  const container = createContainer();

  container.register({
    logger: asValue(logger),
    lifetime: Lifetime.SINGLETON,
  });
  container.register({
    jwt: asValue(jwt),
    lifetime: Lifetime.SINGLETON,
  });
  container.register({
    config: asValue(config),
    lifetime: Lifetime.SINGLETON,
  });
  container.loadModules(
    [
      [
        path.join(__dirname, '../models/*.model.js'),
        { lifetime: Lifetime.SINGLETON, register: asValue },
      ],
    ],
    {
      formatName: (name, descriptor) => {
        let prefix = name.split('.')[0];
        prefix = prefix.charAt(0).toUpperCase() + prefix.substring(1);
        return prefix;
      },
    },
  );
  container.loadModules(
    [
      [
        path.join(__dirname, '../services/*.service.js'),
        {
          lifetime: Lifetime.SCOPED,
          register: asClass,
        },
      ],
      [
        path.join(__dirname, '../validation/*.validator.js'),
        {
          lifetime: Lifetime.SCOPED,
          register: asClass,
        },
      ],
      [
        path.join(__dirname, '../middleware/*.middleware.js'),
        {
          lifetime: Lifetime.SCOPED,
          register: asFunction,
        },
      ],
      [
        path.join(__dirname, '../middleware/*.error.js'),
        {
          lifetime: Lifetime.SCOPED,
          register: asFunction,
        },
      ],
    ],
    {
      formatName: (name, descriptor) => {
        let prefix = name.split('.')[0];
        let suffix = name.split('.')[1];
        suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
        return prefix + suffix;
      },
    },
  );
  logger.info('Dependency Injector loaded.');
  return container;
};
