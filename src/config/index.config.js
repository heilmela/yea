import Joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';

let envPath = path.join(__dirname, `../.env`);
dotenv.config({
  path: envPath,
});
dotenv.config();
const schema = Joi.object()
  .keys({
    app: Joi.object()
      .keys({
        port: Joi.number()
          .required()
          .error(new Error('APP_PORT is undefined')),
        prefix: Joi.string()
          .pattern(/^[a-zA-Z0-9_-]*$/)
          .error(new Error('APP_PREFIX has invalid format')),
        host: Joi.string()
          .required()
          .error(new Error('APP_HOST is undefined')),
      })
      .unknown(true),
    authentication: Joi.object()
      .keys({
        secret: Joi.string()
          .required()
          .error(new Error('APP_SECRET is undefined')),
        expiration: Joi.string(),
      })
      .unknown(true),
    database: Joi.object()
      .keys({
        port: Joi.number(),
        name: Joi.string()
          .required()
          .error(new Error('DB_NAME is undefined')),
        auth: Joi.string(),
        host: Joi.string()
          .required()
          .error(new Error('DB_HOST is undefined')),
        password: Joi.string()
          .required()
          .error(new Error('DB_PASSWORD is undefined')),
        maxRetries: Joi.number(),
        reconnectInterval: Joi.number(),
      })
      .unknown(true),
  })
  .unknown(true);

const config = {
  app: {
    port: process.env.APP_PORT,
    prefix: process.env.APP_PREFIX,
    host: process.env.APP_HOST,
  },
  authentication: {
    secret: process.env.AUTH_SECRET,
    expiration: process.env.AUTH_TOKEN_EXPIRATION || '15m',
  },
  database: {
    port: process.env.DB_PORT,
    name: process.env.MONGO_INITDB_DATABASE,
    auth: process.env.DB_AUTH,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    maxRetries: process.env.DB_MAX_RETRIES || 2,
    reconnectInterval: process.env.DB_RECONNECT_INTERVAL || 5000,
  },
};
let result = schema.validate(config);
if (result?.error) {
  throw new Error(result.error);
}
export default config;
