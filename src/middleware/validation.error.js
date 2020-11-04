import { CelebrateError } from 'celebrate';

export default function error({ logger }) {
  return async (err, req, res, next) => {
    if (err instanceof CelebrateError) {
      let message;
      if (err?.details.has('body')) {
        message = err?.details
          ?.get('body')
          ?.details?.map((msg) => msg.message);
      } else if (err?.details.has('params')) {
        message = err?.details
          ?.get('params')
          ?.details?.map((msg) => msg.message);
      } else {
        message = 'Validation Error';
      }
      logger.debug(err);
      res.status(400).send(message);
    } else {
      return next(err);
    }
  };
}
