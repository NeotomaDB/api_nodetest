const promise = require('bluebird');

const initOptions = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(initOptions);
pgp.pg.types.setTypeParser(20, BigInt);
BigInt.prototype.toJSON = function() {
  try {
    result = this.parseInt();
  }
  catch(err) {
    result = this.toString();
  };
  return result;
};

const ctStr = require('./db_connect.json');

const db = pgp(ctStr);

module.exports = db;
