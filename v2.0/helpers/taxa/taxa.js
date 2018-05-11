// Taxa query:

// This returns an empty object in the case of error.  I might propagate this to other
// endpoints.

var empty = {
  "query": {   'taxonid': null,
                   'name': null,
              'ecolgroup': null,
                  'lower': null
            },
  "response": {
              "taxonid": null,
            "taxoncode": null,
            "taxonname": null,
               "author": null,
                "valid": null,
        "highertaxonid": null,
              "extinct": null,
          "taxagroupid": null,
        "publicationid": null,
          "validatorid": null,
         "validatedate": null,
                "notes": null
    }};
// Sites query:

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const taxonquerylower  = sql('./taxonquerylower.sql');
const taxonquerystatic = sql('./taxonquerystatic.sql');
const taxonbyds = sql('./taxonquerydsid.sql');

// Actual functions:

function taxonbyid (req, res, next) {
  var taxonid = String(req.params.taxonid).split(',').map(function(item) {
    return parseInt(item, 10);
  });

  if (!!taxonid) {
    var query = 'SELECT * FROM ndb.taxa WHERE taxa.taxonid = ANY ($1)';
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: empty,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(query, [taxonid])
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

function taxonbydsid (req, res, next) {
  if (!!req.params.datasetid) {
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(taxonbyds, [datasetid])
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

function gettaxonquery (req, res, next) {
  if (!!req.query.taxonid) {
    var taxonid = String(req.query.taxonid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  } else {
    taxonid = null;
  }

  var outobj = {'taxonid': taxonid,
    'taxonname': req.query.taxonname,
    'status': req.query.status,
    'taxagroup': req.query.taxagroup,
    'ecolgroup': req.query.ecolgroup,
    'lower': req.query.lower,
    'limit': req.query.limit,
    'offset': req.query.offset
  };

  if (typeof outobj.taxonid === 'undefined') {
    outobj.taxonid = null;
  };

  if (!(typeof outobj.taxonname === 'undefined')) {
    outobj.taxonname = outobj.taxonname.replace(/\*/g, '%');
  }

  var novalues = Object.keys(outobj).every(function (x) {
    return typeof outobj[x] === 'undefined' || !outobj[x];
  });

  if (novalues === true) {
    if (!!req.accepts('json') & !req.accepts('html')) {
      res.redirect('/swagger.json');
    } else {
      res.redirect('/api-docs');
    };
  } else {
    if (outobj.lower === 'true') {
      db.any(taxonquerylower, outobj)
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
    };

    if (typeof outobj.lower === 'undefined') {
      db.any(taxonquerystatic, outobj)
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
    };
  };
}

module.exports.taxonbyid = taxonbyid;
module.exports.gettaxonquery = gettaxonquery;
module.exports.taxonbydsid = taxonbydsid;
