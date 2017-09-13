// Sites query:
const path = require('path');

var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("../../db_connect.json");
const bib   = require('./../bib_format');

// Connecting to the database:
var db = pgp(ctStr);

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

const datasetbyidsql = sql('./datasetbyid.sql');
const datasetbysite = sql('./datasetbysite.sql');

function datasetbyid(req, res, next) {
  console.log(req.params.datasetid);
  
  if (!!req.params.datasetid) {
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(datasetbyidsql, [datasetid])
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


function datasetbysiteid(req, res, next) {
  console.log(req.params.siteid);
  
  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass an integer sequence.'
        });
  }

  db.any(datasetbysite, [siteid])
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
  var query = 'SELECT * FROM ndb.datasets as dts WHERE ';

  if (!!datasetid) {
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
module.exports.datasetbysiteid = datasetbysiteid;
module.exports.datasetquery = datasetquery;
