import { celebrate, Segments, Joi } from 'celebrate';
export default class UserValidator {
  constructor({}) {}

  update() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        emails: Joi.array(),
        mainEmailIndex: Joi.number(),
        password: Joi.string(),
        groupformations: Joi.array(),
        isLocked: Joi.boolean(),
      }),
    });
  }

  filter() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string(),
        emails: Joi.array(),
        mainEmailIndex: Joi.number(),
        password: Joi.string(),
        groupformations: Joi.array(),
        isLocked: Joi.boolean(),
      }),
    });
  }
}
