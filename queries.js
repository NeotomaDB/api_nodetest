var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");

console.log(ctStr);

var db = pgp(ctStr);

// add query functions

module.exports = {
  geopoliticalunits: geopoliticalunits,
  geopoliticalunit_id: geopoliticalunit_id,
  publications:publications,
  publication_id:publication_id,
  table:table
};

function table(req, res, next) {
  db.any('SELECT table_name AS table FROM information_schema.tables AS ischeme WHERE ischeme.table_schema=\'public\';')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function geopoliticalunits(req, res, next) {
  db.any('select * from "GeoPoliticalUnits"')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved GeoPoliticalUnits'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function geopoliticalunit_id(req, res, next) {
  var gpuID = parseInt(req.params.id);
  db.one('select * from "GeoPoliticalUnits" where "GeoPoliticalID" = $1', gpuID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved GeoPoliticalUnit ' + gpuID 
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function publications(req, res, next) {
  db.any('select * from "Publications"')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Publications'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function publication_id(req, res, next) {
  
  var pubID = parseInt(req.params.id);
  db.one('select * from "Publications" where "PublicationID" = $1', pubID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Publications'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}