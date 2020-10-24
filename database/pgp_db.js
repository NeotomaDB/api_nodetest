const promise = require('bluebird');

const initOptions = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(initOptions);
pgp.pg.types.setTypeParser(20, BigInt);
const ctStr = require('./db_connect.json');

const db = pgp(ctStr);

db.connect()
  .then(obj => {
    // log server version:
    const serverVersion = obj.client.serverVersion;
    console.log(serverVersion);

    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

module.exports = db;
