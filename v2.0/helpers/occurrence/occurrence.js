// Occurrences query:

var Terraformer = require('terraformer');

var WKT = require('terraformer-wkt-parser');
const path = require('path');
var validate = require('../validateOut').validateOut
var parseTaxa = require('../parsetaxa.js').parseTaxa

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

const occurrencequerysql = sql('./occurrencequery.sql');
const occurrencerecursquerysql = sql('./occurrence_recurs_query.sql');
const occurrencetaxonquerysql = sql('./occurrencebytaxon.sql');
const occurrencebyidsql = sql('./occurrencebyid.sql');

function occurrencebyid (req, res, next) {
  var occid = !!req.params.occurrenceid

  if (occid) {
    var occurrenceid = String(req.params.occurrenceid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  };

  db.any(occurrencebyidsql, [occurrenceid])
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

function occurrencequery (req, res, next) {
  // The broader query:

  if (!!req.query.taxonname) {
    // Split up the name into the accepts and the drops.
    var name = parseTaxa(req.query.taxonname)
  };

  // Get the input parameters:
  var outobj = {
    'occid': String(req.query.occid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'sitename': String(req.query.sitename),
    'altmin': parseInt(String(req.query.altmin)),
    'altmax': parseInt(String(req.query.altmax)),
    'loc': String(req.query.loc),
    'gpid': String(req.query.gpid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'taxonid': String(req.query.taxonid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'taxonname': name['taxa'],
    'taxondrop': name['drop'],
    'lower': req.query.lower,
    'siteid': String(req.query.siteid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'datasettype': String(req.query.datasettype),
    'piid': String(req.query.piid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      }),
    'ageold': parseInt(String(req.query.ageold)),
    'ageyoung': parseInt(String(req.query.ageyoung)),
    'offset': req.query.offset,
    'limit': req.query.limit
  };

  outobj = validate(outobj);

  if (!(typeof outobj.taxonname === 'undefined') & !outobj.taxonname === null) {
    // Adding in or replacing any stars in the name to allow wildcards.
    outobj.taxonname = outobj.taxonname.map(function (x) {
      var gbg = x.replace(/\*/g, '%');
      return x.replace(/\*/g, '%')
    });
  }

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });
    return;
  }

  if (outobj.ageyoung > outobj.ageold & !!outobj.ageyoung & !!outobj.ageold) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'ageyoung is greater than ageold.  Please fix this!'
      });
    return;
  }

  var goodloc = !!outobj.loc

  if (goodloc) {
    try {
      var newloc = JSON.parse(outobj.loc)
      newloc = WKT.convert(JSON.parse(outobj.loc));
    } catch (err) {
      console.log(err);
      newloc = outobj.loc;
    }
    outobj.loc = newloc;
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
    var goodlower = !!outobj.lower;
    var goodtaxa = !!outobj.taxonname || !!outobj.taxonid;
    if (goodtaxa & goodlower & outobj.lower === 'true') {
      db.any(occurrencerecursquerysql, outobj)
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
    } else {
      db.any(occurrencequerysql, outobj)
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
  };
};

function occurrencebytaxon (req, res, next) {
  var taxonIdUsed = !!req.params.taxonid;
  if (taxonIdUsed) {
    var taxonlist = String(req.params.taxonid).split(',').map(function (item) {
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

  db.any(occurrencetaxonquerysql, [taxonlist])
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

module.exports.occurrencequery = occurrencequery;
module.exports.occurrencebytaxon = occurrencebytaxon;
module.exports.occurrencebyid = occurrencebyid;
