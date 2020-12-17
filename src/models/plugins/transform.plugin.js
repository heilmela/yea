export default function (schema, options) {
  schema.set('toObject', {
    transform: transformer,
  });
  schema.set('toJSON', {
    transform: transformer,
  });
}

function transformer(doc, ret, options) {
  delete ret._id;
  delete ret.__v;
  if (options.dto) {
    if (ret?.password) {
      delete ret.password;
    }
  }
}
