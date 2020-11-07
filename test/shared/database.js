import mongoose from 'mongoose';

export async function teardown() {
  if (process?.env?.TEST_PERSIST !== 'true') {
    const collections = await mongoose.connection.db.collections();
    let deleters = [];
    for (let collection of collections) {
      deleters.push(collection.deleteMany({}));
    }
    return Promise.all(deleters)
      .then((resp) => {
        let results = resp.map((result) => result.result);
        let anyFailed = results.some((result) => result.ok !== 1);
        if (anyFailed) {
          throw new Error('Failed to delete a collection');
        } else {
          let deletedCount = results.reduce((acc, result) => {
            return acc + result.n;
          }, 0);
          return `Deleted  ${deletedCount} documents from database`;
        }
      })
      .catch((err) => {
        throw new Error('Failed deleting database data');
      });
  } else {
    return Promise.resolve(
      'TEST_PERSIST is true, database was not deleted',
    );
  }
}
