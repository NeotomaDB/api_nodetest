// pollen query:

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("../db_connect.json");
const bib   = require('./bib_format');

// Connecting to the database:
var db = pgp(ctStr);

function pollen(req, res, next) {
  
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved pollen'
      })
}

module.exports = pollen;