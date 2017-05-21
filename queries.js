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
  publications:publications,
  publication_id:publication_id,
  tables:tables
};

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

function publications(req, res, next) {
  
  // Get the query string:
  var query = {'pubid':req.query.pubid,
               'contactid':req.query.contactid,
               'datasetid':req.query.datasetid,
               'author':req.query.author,
               'pubtype':req.query.pubtype,
               'year':req.query.year,
               'search':req.query.search
             };

  res.status(200)
    .json({
    	status: 'success',
    	query: query,
    	message: 'Retrieved all tables'
    	})

}

function tables(req, res, next) {

  db.any('SELECT table_name AS table FROM information_schema.tables AS ischeme;')
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

  var gpuID = parseInt(req.params.id);
  if (isNaN(gpuID)) {
  	var query = 'select * from "GeoPoliticalUnits"';
  } else {
  	var query = 'select * from "GeoPoliticalUnits" where "GeoPoliticalID" = ' + gpuID;
  } 
  
  console.log(gpuID);

  db.any(query)
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