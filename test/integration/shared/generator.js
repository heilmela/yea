import { expect } from 'chai';
import stringify from 'json-stringify-pretty-compact';

export function expectStatusCode({ res, payload }) {
  return expect(res.status).to.equal(
    payload,
    `Expected ${payload} but got ${res.status} with body: ${stringify(
      res.text,
      {
        maxlength: 20,
        indent: 2,
      },
    )} - Mocha output`,
  );
}

export async function generateUser({ agent, payload }) {
  return agent
    .post('/auth/register')
    .send(payload)
    .then((res) => {
      expectStatusCode({ res: res, payload: 200 });
      expect(res.body).to.be.not.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('user');
      expect(res.body).to.have.property('tokens');
      expect(res.body.user.emails).to.include(payload.email);
      return res.body;
    });
}
