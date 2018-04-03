// Just doing some stuff that's not necessary.

var options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const ctStr = require('../db_connect.json');

const db = pgp(ctStr);

db.proc('version')
  .then(data => {
    //console.log(data.version);
  })
  .catch(error => {
    console.log("error connecting");
  });

module.exports = db;

