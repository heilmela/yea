import server from '../../src/server';
import supertest from 'supertest';
import mongoose from 'mongoose';
import mlog from 'mocha-logger';

import { teardown } from './shared/database';

global.mongoose = mongoose;
global.agent = supertest(server);
global.mlog = mlog;

before(function (done) {
  mlog.pending('Awaiting server start');
  server.on('serverStarted', function () {
    mlog.success('Server started');
    done();
  });
});

after(async () => {
  return teardown()
    .then((resp) => {
      mlog.success(`AFTER ALL: ${resp}`);
    })
    .catch((err) => {
      mlog.error(`AFTER ALL: ${err}`);
    });
});
