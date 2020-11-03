const promise = require('bluebird');

const initOptions = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(initOptions);
pgp.pg.types.setTypeParser(20, BigInt);
const ctStr = require('./db_connect.json');

const db = pgp(ctStr);

module.exports = db;
