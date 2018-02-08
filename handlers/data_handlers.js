const bib   = require('../helpers/bib_format');
//get global database object
var db = require('../database/pgp_db');
var pgp = db.$config.pgp;

// Defining the query functions:
module.exports = {
  chronology:chronology,
  publicationbydataset:publicationbydataset,
  dbtables: function (req, res, next) { 
    var dbtable = require('../helpers/dbtables/dbtables.js');
    dbtable.dbtables(req, res, next); 
  },
  download:download,
  geopoliticalunits: function (req, res, next) { 
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalunits(req, res, next); 
  },
  geopolbysite: function (req, res, next) { 
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopolbysite(req, res, next);
  },
  geopoliticalbyid: function (req, res, next) { 
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalbyid(req, res, next); 
  },
  occurrencebyid: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebyid(req, res, next);
  },
  occurrencequery: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencequery(req, res, next);
  },
  occurrencebytaxon: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebytaxon(req, res, next);
  },
  publicationid:publicationid,
  publicationquery:publicationquery,
  publicationbysite:publicationbysite,
  taxonbyid: function (req, res, next) { 
    var taxon = require('../helpers/taxa/taxa.js');
    taxon.taxonbyid(req, res, next);
  },
  taxonbydsid: function (req, res, next) { 
    var taxon = require('../helpers/taxa/taxa.js');
    taxon.taxonbydsid(req, res, next);
  },
  taxonquery: function (req, res, next) { 
    var taxon = require('../helpers/taxa/taxa.js');
    taxon.gettaxonquery(req, res, next);
  },
  pollen: function (req, res, next) { 
    var pollen = require('../helpers/pollen/pollen.js');
    pollen(req, res, next);
  },
// RETURNING SITES:
  sitesbyid: function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbyid(req, res, next);
  },
  sitesquery:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesquery(req, res, next); 
  },
  sitesbygeopol:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbygeopol(req, res, next);
  },
  sitesbydataset:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbydataset(req, res, next); 
  },
// RETURNING DATASETS
  datasetbyid: function (req, res, next) { 
    var dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbyid(req, res, next); 
  },
  datasetquery: function (req, res, next) { 
    var dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetquery(req, res, next); 
  },
  contactquery: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactquery(req, res, next); 
  },
  contactsbyid: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactsbyid(req, res, next); 
  },
  contactsbydataid: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactsbydataid(req, res, next); 
  },
  contactsbysiteid: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactsbysiteid(req, res, next); 
  },
  chronologybyid: function (req, res, next) {
    var chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybyid(req, res, next);
  },
  chronologybydsid: function (req, res, next) {
    var chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybydsid(req, res, next);
  },
  chronologybystid: function (req, res, next) {
    var chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybystid(req, res, next);
  }

};

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

};

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