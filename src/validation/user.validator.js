import { celebrate, Segments, Joi } from 'celebrate';
export default class UserValidator {
  constructor({}) {}

  update() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        email: Joi.string(),
        password: Joi.string(),
        isLocked: Joi.boolean(),
      }),
    });
  }

  filter() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        isLocked: Joi.boolean(),
      }),
    });
  }
}
