// get global database object (I think I can deprecate this)
// var db = require('../../database/pgp_db');
// var pgp = db.$config.pgp;

// Defining the query functions:
module.exports = {
  dbtables: function (req, res, next) {
    var dbtable = require('../helpers/dbtables/dbtables.js');
    dbtable.dbtables(req, res, next);
  },
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

  // RETURNING PUBLICATIONS
  publicationid: function (req, res, next) {
    var publn = require('../helpers/publications/publications.js');
    publn.publicationid(req, res, next);
  },
  publicationbydataset: function (req, res, next) {
    var publn = require('../helpers/publications/publications.js');
    publn.publicationbydataset(req, res, next);
  },
  publicationbysite: function (req, res, next) {
    var publn = require('../helpers/publications/publications.js');
    publn.publicationbysite(req, res, next);
  },
  publicationquery: function (req, res, next) {
    var publn = require('../helpers/publications/publications.js');
    publn.publicationquery(req, res, next);
  },

  // RETURNING TAXA
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
  sitesquery: function (req, res, next) {
    var sites = require('../helpers/sites/sites.js');
    sites.sitesquery(req, res, next);
  },
  sitesbygeopol: function (req, res, next) {
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbygeopol(req, res, next);
  },
  sitesbydataset: function (req, res, next) {
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbydataset(req, res, next);
  },
  sitesbycontact: function (req, res, next) {
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbycontact(req, res, next);
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
  datasetsbysite: function (req, res, next) {
    var dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbysiteid(req, res, next);
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
  // CHRONOLOGIES
  chronology: chronology,
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
  },

  // DOWNLOADS
  download: download

};

function download (req, res, next) {
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
    })
}

function chronology (req, res, next) {
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
      status: 'success',
      query: query,
      message: 'Retrieved chronology'
    })
}
