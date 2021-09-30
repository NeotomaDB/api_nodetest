// NOTE:  This is a script to deal with the ELC API dataset issue.
// Sites query:
const path = require('path');
// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

const { sql, commaSep, validateOut } = require('../../../src/neotomaapi.js');

var Terraformer = require('terraformer');
var WKT = require('terraformer-wkt-parser');

const datasetquerysql = sql('../v2.0/helpers/dataset_elc/datasetquery.sql');
const datasetbyidsql = sql('../v2.0/helpers/dataset_elc/datasetbyid.sql');
const datasetbysite = sql('../v2.0/helpers/dataset_elc/datasetbysite.sql');

function datasetbyid (req, res, next) {
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = commaSep(req.params.datasetid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(datasetbyidsql, [datasetid])
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = data;
      };
      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function datasetbysiteid (req, res, next) {
  var stIdUsed = !!req.params.siteid;

  if (stIdUsed) {
    var siteid = commaSep(req.params.siteid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass an integer sequence.'
      });
  }

  db.any(datasetbysite, [siteid])
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = data;
      };
      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function datasetquery (req, res, next) {
  // First get all the inputs and parse them:
  var outobj = {
    'datasetid': commaSep(req.query.datasetid),
    'siteid': commaSep(req.query.siteid),
    'piid': commaSep(req.query.piid),
    'datasettype': String(req.query.sitename),
    'altmin': parseInt(String(req.query.altmin)),
    'altmax': parseInt(String(req.query.altmax)),
    'loc': String(req.query.loc),
    'gpid': parseInt(req.query.gpid),
    'ageyoung': parseInt(req.query.ageyoung),
    'ageold': parseInt(req.query.ageold),
    'ageof': parseInt(req.query.ageold),
    'limit': parseInt(req.query.limit),
    'offset':parseInt(req.query.offset)
  };

  outobj = validateOut(outobj);

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });
  }

  if (outobj.ageyoung > outobj.ageold & !!outobj.ageold & !!outobj.ageyoung) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The older age is smaller than the younger age.  Neotoma ages are assumed to be in calibrated radiocarbon years since 1950, decreasing to the present and increasing through the Pleistocene.'
      });
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

  db.any(datasetquerysql, outobj)
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = data;
      };
      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports.datasetbyid = datasetbyid;
module.exports.datasetbysiteid = datasetbysiteid;
module.exports.datasetquery = datasetquery;
