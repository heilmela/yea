import { celebrate, Segments, Joi } from 'celebrate';
export default class AuthValidator {
  constructor({}) {}

  email() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
      }),
    });
  }
  credentials() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    });
  }
  refresh() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        refreshToken: Joi.string().required(),
      }),
    });
  }
}
