var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");

// Connecting to the database:
var db = pgp(ctStr);

// Defining the query functions:

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
  sites:site,
  dataset:dataset,
  download:download
};

function dbtables(req, res, next) {

  var tableID = req.params.table;

  if (tableID == null) {
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
      res.status(500)
        .json({
          status:'error',
          data: err,
          message:'Got an error.'
        });
    });
};


function site(req, res, next) {
  
  // Get the query string:
  var query = {};

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

    db.any('SELECT * FROM "Contacts"')
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


  console.log(req.query);

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved contacts'
      })

}


function dataset(req, res, next) {
  
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

function download(req, res, next) {
  
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
  var query = {'PublicationID':req.pubid,
               'PublicationID':req.query.pubid,
               'contactid':req.query.contactid,
               'datasetid':req.query.datasetid,
               'author':req.query.author,
               'PubType':req.query.pubtype,
               'Year':req.query.year,
               'search':req.query.search
             };
  console.log(query);

  query = Object.keys(query).filter(function(key) {
      return !isNaN(query[key]);
      });
  
  console.log('...');
  console.log(query);
  
  db.any('SELECT * FROM publications WHERE')
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


  console.log(query);

  res.status(200)
    .json({
    	status: 'success',
    	query: query,
    	message: 'Retrieved all tables'
    	})

};


function geopoliticalunits(req, res, next) {

  var gpuID = parseInt(req.params.gpid);
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