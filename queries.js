var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");

// Connecting to the database:
var db = pgp(ctStr);

// add query functions

module.exports = {
  geopoliticalunits:geopoliticalunits,
  publications:publications,
  dbtables:dbtables,
  chronology:chronology,
  contacts:contacts,
  occurrence:occurrence,
  pollen:pollen,
  taxa:taxa,
  site:site,
  sites:site
};

function site(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved sites'
      })

}

function taxa(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved taxa'
      })

}

function pollen(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved pollen'
      })

}

function occurrence(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved occurrences'
      })

}


function contacts(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved contacts'
      })

}


function chronology(req, res, next) {
  
  // Get the query string:
  var query = {};

  console.log(query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
      })

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

  console.log(query);

  res.status(200)
    .json({
    	status: 'success',
    	query: query,
    	message: 'Retrieved all tables'
    	})

}

function dbtables(req, res, next) {

  var tableID = parseInt(req.params.id);
  if (isNaN(tableID)) {
  	var query = 'SELECT table_name AS table FROM information_schema.tables AS ischeme;';
  } else {
  	var query = 'select * from "' + tableID + '"';
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