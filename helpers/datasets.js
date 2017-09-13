// Sites query:

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

function datasetbyid(req, res, next) {
  
  var datasetid = req.params.datasetid;

  // Get the query string:
  var query = 'select * from ndb.datasets as dts where ';

  if (datasetid) {
    query = query + 'dts.datasetid = '  + datasetid;
    console.log("query is: "+query);
  }

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });

}

function datasetquery(req, res, next) {
  
  var datasetid = req.params.datasetid;

  // Get the query string:
  var query = 'select * from ndb.datasets as dts where ';

  if (datasetid) {
    query = query + 'dts.datasetid = '  + datasetid;
  }

  db.any(query)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });

}

module.exports.datasetbyid = datasetbyid;
