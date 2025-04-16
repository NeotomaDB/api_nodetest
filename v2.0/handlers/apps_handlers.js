'use strict';
// get global database object
module.exports = {
  datasettypes: datasettypes,
  collectiontypes: collectiontypes,
  taxaindatasets: taxaindatasets,
  taxagrouptypes: taxagrouptypes,
  keywords: keywords,
  authorpis: authorpis,
  taphonomysystems: taphonomysystems,
  depositionalenvironments: depositionalenvironments,
  datasetsummary: function(req, res, next) {
    const dssum = require('../helpers/landing/landing.js');
    dssum.datasetbydbid(req, res, next);
  },
  datasetuploads: function(req, res, next) {
    const dsup = require('../helpers/landing/landing.js');
    dsup.dsuploadagg(req, res, next);
  },
  datasetsbypi: function(req, res, next) {
    const dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetbypi(req, res, next);
  },
  datasetranges: function(req, res, next) {
    const dage = require('../helpers/landing/landing.js');
    dage.datasetagesbydbid(req, res, next);
  },
  databasesummaries: function(req, res, next) {
    const dbsumm = require('../helpers/landing/landing.js');
    dbsumm.databasesummaries(req, res, next);
  },
  contactoverview: function(req, res, next) {
    const ctsumm = require('../helpers/contacts/contacts.js');
    ctsumm.contactclassbydsid(req, res, next);
  },
  contact_orcid: function(req, res, next) {
    const ct_orcid = require('../helpers/landing/landing.js');
    ct_orcid.orcid_by_contact_id(req, res, next);
  },
  orcid_contact: function(req, res, next) {
    const or_contact = require('../helpers/landing/landing.js');
    or_contact.contact_by_orcid_id(req, res, next);
  },
};

// Defining the query functions:

/* All the Endpoint functions */
/**
 * Return metadata about the different collection types in Neotoma.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function collectiontypes(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.getcollectiontypes()')
      .then(function(data) {
        res.status(200)
            .type('application/json')
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all collectiontypes',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return metadata about the different dataset types in Neotoma.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function datasettypes(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.getdatasettypes();')
      .then(function(data) {
        res.status(200)
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all datasettypes',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return the list of taxa that are reported from all Neotoma datasets.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function taxaindatasets(req, res, next) {
  const db = req.app.locals.db;
  db.query('SELECT * FROM ap.taxaindatasetview;')
      .then(function(data) {
        res.status(200)
            .type('application/json')
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all taxa in datasets',
            });
      }).catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return metadata about the different taxongroups used in Neotoma.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function taxagrouptypes(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.gettaxagrouptypes();')
      .then(function(data) {
        res.status(200)
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all taxagrouptypes',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return the set of keywords reported in the Neotoma keywords table.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function keywords(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.getkeywords();')
      .then(function(data) {
        res.status(200)
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all keywords',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return the full list of Neotoma PIs assigned to databases.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function authorpis(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.getpeople();')
      .then(function(data) {
        res.status(200)
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved all authors PIs',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}

/**
 * Return metadata about the different taphonomic systems reported for a
 * dataset type.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function taphonomysystems(req, res, next) {
  const db = req.app.locals.db;
  // Get the query string:
  const datasettypeid = req.query.datasettypeid;

  if (!datasettypeid) {
    res.status(200)
        .jsonp({
          status: 'failure',
          data: null,
          message: 'No datasetTypeId provided.',
        });
  } else {
    db.query('select ap.gettaphonomicsystems(${dsty});',
        {'dsty': datasettypeid})
        .then(function(data) {
          res.status(200)
              .jsonp({
                status: 'success',
                data: data,
                message: 'Retrieved taphonomic system for dataset type id',
              });
        })
        .catch(function(err) {
          res.status(500)
              .json({
                status: 'failure',
                data: err.message,
              });
        });
  }
}

/**
 * Return metadata about the different depositional environments
 * reported in Neotoma.
 * @param {req} req - An express request object.
 * @param {res} res - An express response object.
 * @param {any} next - An express next object.
 */
function depositionalenvironments(req, res, next) {
  const db = req.app.locals.db;
  db.query('select ap.getdeptenvtypesroot();')
      .then(function(data) {
        res.status(200)
            .jsonp({
              status: 'success',
              data: data,
              message: 'Retrieved root depositional environment types',
            });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
            });
      });
}  


