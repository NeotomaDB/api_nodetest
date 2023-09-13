// NOTE:  This is a script to deal with the ELC API dataset issue.
const { sql, commaSep, getparam, ifUndef } = require('../../../src/neotomaapi.js');

var Terraformer = require('terraformer');
var WKT = require('terraformer-wkt-parser');

const datasetquerysql = sql('../v2.0/helpers/dataset_elc/datasetquery.sql');
const datasetbyidsql = sql('../v2.0/helpers/dataset_elc/datasetbyid.sql');
const datasetbysite = sql('../v2.0/helpers/dataset_elc/datasetbysite.sql');

function datasetbyid (req, res, next) {
  let db = req.app.locals.db
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
  let db = req.app.locals.db
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
  let db = req.app.locals.db
  // First get all the inputs and parse them:
  let paramgrab = getparam(req)

  if (!paramgrab.success) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: paramgrab.message
      });
  } else {
    var resultset = paramgrab.data

    var outobj = {
      'datasetid': ifUndef(resultset.datasetid, 'sep'),
      'siteid': ifUndef(resultset.siteid, 'sep'),
      'piid': ifUndef(resultset.piid, 'sep'),
      'sitename': ifUndef(resultset.sitename, 'sep'),
      'datasettype': ifUndef(resultset.datasettype, 'string'),
      'altmin': ifUndef(resultset.altmin, 'int'),
      'altmax': ifUndef(resultset.altmax, 'int'),
      'loc': ifUndef(resultset.loc, 'string'),
      'gpid': ifUndef(resultset.gpid, 'int'),
      'ageyoung': ifUndef(resultset.ageyoung, 'int'),
      'ageold': ifUndef(resultset.ageold, 'int'),
      'ageof': ifUndef(resultset.ageold, 'int'),
      'limit': ifUndef(resultset.limit, 'int'),
      'offset': ifUndef(resultset.offset, 'int')
    };
  }

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
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

module.exports.datasetbyid = datasetbyid;
module.exports.datasetbysiteid = datasetbysiteid;
module.exports.datasetquery = datasetquery;
