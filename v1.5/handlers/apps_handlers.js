// get global database object
var dbtest = require('../../database/pgp_db').dbheader

module.exports = {
  datasettypes: datasettypes,
  collectiontypes: collectiontypes,
  elementtypes: elementtypes,
  geochronologies: function (req, res, next) {
    var geochronologies = require('../helpers/geochronologies/geochronologies.js');
    geochronologies.geochronologies(req, res, next);
  },
  taxaindatasets: taxaindatasets,
  taxagrouptypes: taxagrouptypes,
  keywords: keywords,
  authorpis: authorpis,
  authors: authors,
  taphonomysystems: taphonomysystems,
  depositionalenvironments: depositionalenvironments,
  depositionalenvironmentsbyid: depositionalenvironmentsbyid,
  relativeages: relativeages,
  search: function (req, res, next) {
    console.log('calling search helper');
    var exsearch = require('../helpers/search/search.js');
    exsearch.explorersearch(req, res, next);
  }
};

// Defining the query functions:

/* All the Endpoint functions */
function collectiontypes (req, res, next) {
  let db = dbtest(req)
  db.query('SELECT * FROM ap.getcollectiontypes()')
    .then(function (data) {
      res.status(200)
        .type('application/json')
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all collectiontypes'
        })
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Ran into an error.'
        });
    })
}

function datasettypes (req, res, next) {
  let db = dbtest(req)

  db.query('SELECT * FROM ap.getdatasettypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all datasettypes'
        })
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Ran into an error.'
        });
    });
}

function elementtypes (req, res, next) {
  let db = dbtest(req)

  var taxonid, taxagroupid;
  taxonid = req.query.taxonid;
  taxagroupid = req.query.taxagroupid;

  if (!parseInt(taxonid) && !taxagroupid) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No taxagroupid or taxonid provided. Query requires one.'
      })
  } else {
    if (!taxagroupid) {
      db.query('SELECT * FROM ap.getelementtypesbytaxonid($1)', [taxonid])
        .then(function (data) {
          res.status(200)
            .type('application/json')
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved all elementtypes for taxonid'
            })
        })
        .catch(function (err) {
          return next(err);
        })
    } else {
      db.query('SELECT * FROM ap.getelementtypes($1)', [taxagroupid])
        .then(function (data) {
          res.status(200)
            .type('application/json')
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved all elementtypes for taxagroupid'
            })
        })
        .catch(function (err) {
          return next(err);
        })
    }
  }
}

function taxaindatasets (req, res, next) {
  let db = dbtest(req)
  db.query('SELECT * FROM ap.taxaindatasetview;')
    .then(function (data) {
      // data are records of (taxonid, taxonname, taxagroupid, datasettypeid)
      // desired output:  [...,{"TaxonName":"Acalypha-type","TaxonID":27017,"TaxaGroupID":"VPL","DatasetTypeIDs":[3,4,7,23]},...]
      res.status(200)
        .type('application/json')
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all taxa in datasets'
        })
    }).catch(function (err) {
      return next(err);
    })
}

function taxagrouptypes (req, res, next) {
  let db = dbtest(req)

  db.query('SELECT * FROM ap.gettaxagrouptypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
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
  let db = dbtest(req)
  db.query('SELECT * FROM ap.getkeywords();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
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
  let db = dbtest(req)

  db.query('SELECT * FROM ap.getpeople();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all authors PIs'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function authors (req, res, next) {
  let db = dbtest(req)

  db.query('SELECT * FROM ap.getauthors();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all authors'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function taphonomysystems (req, res, next) {
  // Get the query string:
  var datasetTypeId = req.query.datasetTypeId;
  let db = dbtest(req)

  if (!datasetTypeId) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No datasetTypeId provided.'
      })
  } else {
    db.query('SELECT * FROM ap.gettaphonomicsystems(' + datasetTypeId + ');')
      .then(function (data) {
        res.status(200)
          .jsonp({
            success: 1,
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
  let db = dbtest(req)

  db.query('SELECT * FROM ap.getdeptenvtypesroot();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved root depositional environment types'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function depositionalenvironmentsbyid (req, res, next) {
  let db = dbtest(req)
  // Get the query string:
  var depenvtid = req.params.id;
  console.log('depenvtid is: ' + depenvtid);

  if (isNaN(depenvtid)) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No depenvtid provided.'
      })
  } else {
    db.query('SELECT * FROM ap.getdeptenvtypes($1);', [depenvtid])
      .then(function (data) {
        res.status(200)
          .jsonp({
            success: 1,
            status: 'success',
            data: data,
            message: 'Retrieved depositional environment types'
          })
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

function relativeages (req, res, next) {
  let db = dbtest(req)
  // Get the query string:
  var ageScaleID = req.query.agescaleid;
  if (!req.query.agescaleid || !parseInt(req.query.agescaleid)) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No agescaleid provided.'
      })
  }

  db.query('SELECT * FROM ndb.relativeages where relativeagescaleid = $1;', [ageScaleID])
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved relativeages'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}
