import { celebrate, Segments, Joi } from 'celebrate';
export default class CommonValidator {
  constructor({}) {}

  id_in_params() {
    return celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
      }),
    });
  }

  id_in_body() {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
      }),
    });
  }
}
