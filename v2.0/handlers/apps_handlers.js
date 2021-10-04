// const bib = require('../helpers/bib_format');

// get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

module.exports = {
  datasettypes: datasettypes,
  collectiontypes: collectiontypes,
  taxaindatasets: taxaindatasets,
  taxagrouptypes: taxagrouptypes,
  keywords: keywords,
  authorpis: authorpis,
  taphonomysystems: taphonomysystems,
  depositionalenvironments: depositionalenvironments
};

// Defining the query functions:

/* All the Endpoint functions */
function collectiontypes (req, res, next) {
  db.query('select ap.getcollectiontypes()')
    .then(function (data) {
      res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all collectiontypes'
        })
    })
    .catch(function (err) {
      return next(err);
    })
}

function datasettypes (req, res, next) {

  db.query('select ap.getdatasettypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all datasettypes'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function taxaindatasets (req, res, next) {
  db.query('SELECT * FROM ap.gettaxaindatasets()')
    .then(function (data) {
      var agg = []
      for (let k = 0; k < data.length; k++) {
        var indexer = agg.map(x => x.taxonid).indexOf(data[k].taxonid)
        if (indexer > -1) {
          agg[indexer]['datasettypeid'] = [agg[indexer]['datasettypeid'], data[k]['datasettypeid']].flat()
        } else {
          agg.push(data[k])
        }
      }

      res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: agg,
          message: 'Retrieved all taxa in datasets'
        })
    }).catch(function (err) {
      return next(err);
    })
}

function taxagrouptypes (req, res, next) {

  db.query('select ap.gettaxagrouptypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all taxagrouptypes'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function keywords (req, res, next) {

  db.query('select ap.getkeywords();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all keywords'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function authorpis (req, res, next) {

  db.query('select ap.getpeople();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all authors PIs'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function taphonomysystems (req, res, next) {
  // Get the query string:
  var datasettypeid = req.query.datasettypeid;

  if (!datasettypeid) {
    res.status(200)
      .jsonp({
        status: 'failure',
        data: null,
        message: 'No datasetTypeId provided.'
      })
  } else {
    db.query('select ap.gettaphonomicsystems(' + datasettypeid + ');')
      .then(function (data) {
        res.status(200)
          .jsonp({
            status: 'success',
            data: data,
            message: 'Retrieved taphonomic system for dataset type id'
          })
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

function depositionalenvironments (req, res, next) {

  db.query('select ap.getdeptenvtypesroot();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved root depositional environment types'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}
