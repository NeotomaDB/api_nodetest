// Occurrences query:
const Terraformer = require('terraformer');
const he = require('he')
const WKT = require('terraformer-wkt-parser');
const path = require('path');
const parseTaxa = require('../parsetaxa.js').parseTaxa

// get global database object
const db = require('../../../database/pgp_db');
const pgp = db.$config.pgp;

const { sql, commaSep, ifUndef, removeEmpty, validateOut } = require('../../../src/neotomaapi.js');

const occurrencequerysql = sql('../v2.0/helpers/occurrence/occurrencequery.sql');
const occurrencerecursquerysql = sql('../v2.0/helpers/occurrence/occurrence_recurs_query.sql');
const occurrencetaxonquerysql = sql('../v2.0/helpers/occurrence/occurrencebytaxon.sql');
const occurrencebyidsql = sql('../v2.0/helpers/occurrence/occurrencebyid.sql');

function occurrencebyid (req, res, next) {
  var occid = !!req.params.occurrenceid

  if (occid) {
    var occurrenceid = commaSep(req.params.occurrenceid);
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

  if (req.query.taxonname) {
    // Split up the name into the accepts and the drops.
    var name = parseTaxa(req.query.taxonname)
  } else {
    name = {
      taxa: null,
      drop: null
    };
  }

  // Get the input parameters:
  var outobj = {
    'occurrenceid': commaSep(req.query.occurrenceid),
    'sitename': String(req.query.sitename),
    'altmin': parseInt(String(req.query.altmin)),
    'altmax': parseInt(String(req.query.altmax)),
    'loc': he.decode(String(req.query.loc)),
    'gpid': commaSep(req.query.gpid),
    'taxonid': commaSep(req.query.taxonid),
    'taxonname': name['taxa'],
    'taxondrop': name['drop'],
    'lower': req.query.lower,
    'siteid': commaSep(req.query.siteid),
    'datasettype': String(req.query.datasettype),
    'piid': commaSep(req.query.piid),
    'ageold': parseInt(String(req.query.ageold)),
    'ageyoung': parseInt(String(req.query.ageyoung)),
    'offset': req.query.offset,
    'limit': req.query.limit
  };

  outobj = validateOut(outobj);

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
      newloc = outobj.loc;
    }
    outobj.loc = newloc;
  }

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

function occurrencebytaxon (req, res, next) {
  var taxonIdUsed = !!req.params.taxonid;
  if (taxonIdUsed) {
    var taxonlist = commaSep(req.params.taxonid);
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
