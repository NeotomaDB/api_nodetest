// get global database object
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
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function datasettypes (req, res, next) {
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function taxaindatasets (req, res, next) {
  let db = req.app.locals.db
  db.query('SELECT * FROM ap.taxaindatasetview;')
    .then(function (data) {
      res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all taxa in datasets'
        })
    }).catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function taxagrouptypes (req, res, next) {
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function keywords (req, res, next) {
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function authorpis (req, res, next) {
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function taphonomysystems (req, res, next) {
  let db = req.app.locals.db
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
        res.status(500)
          .json({
            status: 'failure',
            data: err.message
          });
      });
  }
}

function depositionalenvironments (req, res, next) {
  let db = req.app.locals.db
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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}
