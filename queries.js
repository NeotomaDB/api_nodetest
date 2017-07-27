var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var ctStr = require("./db_connect.json");
const bib   = require('./helpers/bib_format');

//var db = pgp(ctStr);

//module.exports = db;
// Connecting to the database:
//

// Defining the query functions:

module.exports = {
  chronology:chronology,
  contacts:contacts,
  download:download,
  occurrence:occurrence,
  publicationid:publicationid,
  publicationquery:publicationquery,
  publicationbydataset:publicationbydataset,
  publicationbysite:publicationbysite,
  taxonid: function (req, res, next) { 
    var taxon = require('./helpers/taxa.js');
    taxon.gettaxa(req, res, next);
  },
  taxonquery: function (req, res, next) { 
    var taxon = require('./helpers/taxa.js');
    taxon.gettaxonquery(req, res, next);
  },
  pollen: function (req, res, next) { 
    var pollen = require('./helpers/pollen.js');
    pollen(req, res, next);
  },

// RETURNING SITES:
  sitesbyid: function (req, res, next) { 
    var sites = require('./helpers/sites/sites.js');
    sites.sitesbyid(req, res, next);
  },
  sitesquery:function (req, res, next) { 
    var sites = require('./helpers/sites/sites.js');
    sites.sitesquery(req, res, next); 
  },
  sitesbydataset:function (req, res, next) { 
    var sites = require('./helpers/sites/sites.js');
    sites.sitesbydataset(req, res, next); 
  },
// RETURNING GEOPOLITICAL UNITS
  geopoliticalunits: function (req, res, next) { 
    var dbtable = require('./helpers/geopoliticalunits.js');
    dbtable(req, res, next); 
  },
  geopolbysite: function (req, res, next) { 
    var dbtable = require('./helpers/geopoliticalunits.js');
    dbtable(req, res, next); 
  },
// RETURNING DATASETS
  dataset: function (req, res, next) { 
    var dataset = require('./helpers/datasets.js');
    dataset.datasetbyid(req, res, next); 
  },
  datasetquery: function (req, res, next) { 
    var datasetquery = require('./helpers/datasets.js');
    dataset.datasetquery(req, res, next); 
  },
  dbtables: function (req, res, next) { 
    var dbtable = require('./helpers/dbtables.js');
    dbtable.dbtables(req, res, next); 
  }

};

/* All the Endpoint functions */


function occurrence(req, res, next) {
  
  // Get the query string:
  var query = {};

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


  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved contacts'
      })

}


function dataset(req, res, next) {
  
  // Get the query string:
  var pubid = req.query.pubid;
  var datasetid = req.query.datasetid;
  var siteid = req.query.siteid;

  // Get the query string:
  var query = 'SELECT * FROM "Datasets" as dts WHERE ';

  if (!!datasetid) {
    query = query + 'dts."DatasetID" = '  + datasetid;
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

function download(req, res, next) {
  
  // Get the query string:
  var query = {};

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

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
      })

}


function publicationid(req, res, next) {
  
  if (!!req.params.pubid) {
    var pubid = parseInt(req.params.pubid);
  } else {
    var pubid = null;
  }
  
  var query = 'select * from ndb.publications AS pubs where pubs.publicationid = ' + pubid;
  


  output = db.any(query)
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });    })
    .catch(function (err) {
      return next(err);
    });
};

function publicationquery(req, res, next) {
  
};

function publicationbysite(req, res, next) {

}

function publicationbydataset(req, res, next) {

  /*
  Get publications by associated dataset IDs:
  */

  if (!!req.params.datasetid) {
  
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

    query = 'WITH dpub AS '+
            '(SELECT * FROM ndb.datasetpublications as dp ' +
            'WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv))) ' +
            'SELECT * FROM ndb.publications AS pub INNER JOIN ' +
            'ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid INNER JOIN ' +
            'ndb.contacts as ca ON ca.contactid = pa.contactid ' +
            'WHERE pub.publicationid IN (SELECT publicationid FROM dpub)'

  }
  
  output = db.any(query, [datasetid])
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .json({
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}