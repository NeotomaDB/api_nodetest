// get global database object (I think I can deprecate this)
// var db = require('../../database/pgp_db');
// var pgp = db.$config.pgp;

// Defining the query functions:
module.exports = {
  oxcalibrate: function (req, res, next) {
    const oxcal = require('../oxcal/oxcal.js');
    oxcal.calibrate(req, res, next);
  },
  frozen: function (req, res, next) {
    const frozen = require('../helpers/frozendata/frozen.js');
    frozen.frozenbyid(req, res, next);
  },
  dbtables: function (req, res, next) {
    const dbtable = require('../helpers/dbtables/dbtables.js');
    dbtable.dbtables(req, res, next);
  },
  geopoliticalunits: function (req, res, next) {
    const geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalunits(req, res, next);
  },
  geopolbysite: function (req, res, next) {
    const geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopolbysite(req, res, next);
  },
  geopoliticalbyid: function (req, res, next) {
    const geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalbyid(req, res, next);
  },
  occurrencebyid: function (req, res, next) {
    const occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebyid(req, res, next);
  },
  occurrencequery: function (req, res, next) {
    const occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencequery(req, res, next);
  },
  occurrencebytaxon: function (req, res, next) {
    const occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebytaxon(req, res, next);
  },
  // RETURNING PUBLICATIONS
  publicationid: function (req, res, next) {
    const publn = require('../helpers/publications/publications.js');
    publn.publicationid(req, res, next);
  },
  publicationbydataset: function (req, res, next) {
    const publn = require('../helpers/publications/publications.js');
    publn.publicationbydataset(req, res, next);
  },
  publicationbysite: function (req, res, next) {
    const publn = require('../helpers/publications/publications.js');
    publn.publicationbysite(req, res, next);
  },
  publicationquery: function (req, res, next) {
    const publn = require('../helpers/publications/publications.js');
    publn.publicationquery(req, res, next);
  },

  // RETURNING TAXA
  taxonbyid: function (req, res, next) {
    const taxon = require('../helpers/taxa/taxa.js');
    taxon.taxonbyid(req, res, next);
  },
  taxonbydsid: function (req, res, next) {
    const taxon = require('../helpers/taxa/taxa.js');
    taxon.taxonbydsid(req, res, next);
  },
  taxonquery: function (req, res, next) {
    const taxon = require('../helpers/taxa/taxa.js');
    taxon.gettaxonquery(req, res, next);
  },
  pollen: function (req, res, next) {
    const pollen = require('../helpers/pollen/pollen.js');
    pollen(req, res, next);
  },

  // RETURNING SITES:
  sitesbyid: function (req, res, next) {
    const sites = require('../helpers/sites/sites.js');
    sites.sitesbyid(req, res, next);
  },
  sitesquery: function (req, res, next) {
    const sites = require('../helpers/sites/sites.js');
    sites.sitesquery(req, res, next);
  },
  sitesbygeopol: function (req, res, next) {
    const sites = require('../helpers/sites/sites.js');
    sites.sitesbygeopol(req, res, next);
  },
  sitesbydataset: function (req, res, next) {
    const sites = require('../helpers/sites/sites.js');
    sites.sitesbydataset(req, res, next);
  },
  sitesbycontact: function (req, res, next) {
    const sites = require('../helpers/sites/sites.js');
    sites.sitesbycontact(req, res, next);
  },

  // RETURNING DATASETS FOR ELC
  datasetbyid_elc: function (req, res, next) {
    const dataset = require('../helpers/dataset_elc/datasets.js');
    dataset.datasetbyid(req, res, next);
  },
  datasetquery_elc: function (req, res, next) {
    const dataset = require('../helpers/dataset_elc/datasets.js');
    dataset.datasetquery(req, res, next);
  },
  datasetsbysite_elc: function (req, res, next) {
    const dataset = require('../helpers/dataset_elc/datasets.js');
    dataset.datasetbysiteid(req, res, next);
  },

  // RETURNING DATASETS
  datasetbyid: function (req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbyid(req, res, next);
  },
  datasetquery: function (req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetquery(req, res, next);
  },
  datasetsbysite: function (req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbysiteid(req, res, next);
  },
  datasetsbygeopol: function (req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetsbygeopol(req, res, next);
  },
  datasetsbydb: function (req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbydb(req, res, next);
  },
  contactquery: function (req, res, next) {
    const contact = require('../helpers/contacts/contacts.js');
    contact.contactquery(req, res, next);
  },
  contactsbyid: function (req, res, next) {
    const contact = require('../helpers/contacts/contacts.js');
    contact.contactsbyid(req, res, next);
  },
  contactsbydataid: function (req, res, next) {
    const contact = require('../helpers/contacts/contacts.js');
    contact.contactsbydataid(req, res, next);
  },
  contactsbysiteid: function (req, res, next) {
    const contact = require('../helpers/contacts/contacts.js');
    contact.contactsbysiteid(req, res, next);
  },
  // Chronologies
  chronologiesbyid: function (req, res, next) {
    const chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybyid(req, res, next);
  },
  chronologiesbydsid: function (req, res, next) {
    const chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybydsid(req, res, next);
  },
  chronologiesbystid: function (req, res, next) {
    const chronology = require('../helpers/chronology/chronology.js');
    chronology.chronologybystid(req, res, next);
  },
  downloadbyid: function (req, res, next) {
    const download = require('../helpers/download/download.js');
    download.downloadbyid(req, res, next);
  },

  // DOIs
  doibydsid: function (req, res, next) {
    const dois = require('../helpers/doi/dois.js');
    dois.doibydsid(req, res, next);
  },

  //Vue app calls:
  shortCall: function(req, res, next) {
    const shortCall = require('../helpers/vueapp/shortcalls.js');
    shortCall.shortCall(req, res, next);
  },

  // SUMMARIES
  dstypemonth: function (req, res, next) {
    const summaries = require('../helpers/summary/summary.js');
    summaries.datasettypesbymonths(req, res, next);
  },
  dsdbmonth: function (req, res, next) {
    const summaries = require('../helpers/summary/summary.js');
    summaries.datasetdbsbymonths(req, res, next);
  },
  rawbymonth: function (req, res, next) {
    const summaries = require('../helpers/summary/summary.js');
    summaries.rawbymonth(req, res, next);
  },
  lithologybydsid: function (req, res, next) {
    const lithologies = require('../helpers/lithology/lithology.js');
    lithologies.lithologybydsid(req, res, next);
  },
  specimensbydsid: function (req, res, next) {
    const specimens = require('../helpers/specimens/specimens.js');
    specimens.specimenbyid(req, res, next);
  }
};
