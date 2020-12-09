import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from '@hapi/joi';

const userSchema = new mongoose.Schema({
  email: String,
  password: {
    type: String,
    protected: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  //var result = await bcrypt.compare(password, this.password);
  var result;
  try {
    result = await bcrypt.compare(password, this.password);
  } catch (err) {
    result = false;
  }

  return result;
};

userSchema.methods.joiValidate = function (object) {
  var schema = Joi.object({
    emails: Joi.array().items(Joi.string().email()).required(),
    password: Joi.string(),
    isLocked: Joi.boolean(),
  });
  return schema.validate(object);
};
userSchema.methods.isValidEmail = function (email) {
  var schema = Joi.string().email();
  return schema.validate(email);
};

export default mongoose.model('User', userSchema);
