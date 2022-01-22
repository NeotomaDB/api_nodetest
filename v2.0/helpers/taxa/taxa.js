// Taxa query:

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const { sql } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const taxonquerylower = sql('../v2.0/helpers/taxa/taxonquerylower.sql');
const taxonquerystatic = sql('../v2.0/helpers/taxa/taxonquerystatic.sql');
const taxonbyds = sql('../v2.0/helpers/taxa/taxonquerydsid.sql');

// Actual functions:

function taxonbyid (req, res, next) {
  var taxonid = String(req.params.taxonid).split(',').map(function (item) {
    return parseInt(item, 10);
  });
  var goodid = !!taxonid

  if (goodid) {
    var query = 'SELECT * FROM ndb.taxa WHERE taxa.taxonid = ANY ($1)';
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: [],
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
  var goodds = !!req.params.datasetid;
  if (goodds) {
    var datasetid = String(req.params.datasetid).split(',').map(function (item) {
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
  var goodtx = !!req.query.taxonid
  if (goodtx) {
    var taxonid = String(req.query.taxonid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  } else {
    taxonid = null;
  }

  if (req.query.taxonname) {
    var name = String(req.query.taxonname).toLowerCase().split(',')
  };
  if (req.query.taxagroup) {
    var taxagroup = String(req.query.taxagroup).toLowerCase().split(',')
  };
  if (req.query.ecolgroup) {
    var ecolgroup = String(req.query.ecolgroup).toLowerCase().split(',')
  };

  var outobj = { 'taxonid': taxonid,
    'taxonname': name,
    'status': req.query.status === 1,
    'taxagroup': taxagroup,
    'ecolgroup': ecolgroup,
    'lower': req.query.lower,
    'limit': req.query.limit,
    'offset': req.query.offset
  }

  if (typeof outobj.taxonid === 'undefined') {
    outobj.taxonid = null;
  };

  if (!(typeof outobj.taxonname === 'undefined')) {
    outobj.taxonname = outobj.taxonname.map(function (x) {
      var gbg = x.replace(/\*/g, '%');
      return x.replace(/\*/g, '%')
    });
  }
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
