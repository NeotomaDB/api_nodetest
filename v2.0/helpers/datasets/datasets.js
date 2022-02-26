// get global database object
const he = require('he')
const db = require('../../../database/pgp_db');

const { sql, validateOut } = require('../../../src/neotomaapi.js');

var Terraformer = require('terraformer');
var WKT = require('terraformer-wkt-parser');

const datasetquerysql = sql('../v2.0/helpers/datasets/datasetqueryv2.sql');
const datasetbyidsql = sql('../v2.0/helpers/datasets/datasetbyid.sql');
const datasetbydbsql = sql('../v2.0/helpers/datasets/datasetbydb.sql');
const datasetbysite = sql('../v2.0/helpers/datasets/datasetbysite.sql');
const datasetbygpidsql = sql('../v2.0/helpers/datasets/datasetbygpid.sql');

function datasetsbygeopol (req, res, next) {
  var gpIdUsed = !!req.params.gpid;

  if (gpIdUsed) {
    var gpid = String(req.params.gpid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(datasetbygpidsql, [gpid])
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

function datasetbyid (req, res, next) {
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = String(req.params.datasetid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
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

function datasetbydb (req, res, next) {
  var dbUsed = !!req.query.database;

  if (dbUsed) {
    var database = { 'database': req.query.database,
      'limit': parseInt(req.query.limit),
      'offset': parseInt(req.query.offset)
    }
    database = validateOut(database)
  } else {
    var database = { 'database': '',
      'limit': parseInt(req.query.limit),
      'offset': parseInt(req.query.offset)
    }
    database = validateOut(database)
  }

  db.any(datasetbydbsql, database)
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
    var siteid = String(req.params.siteid).split(',').map(function (item) {
      return parseInt(item, 10);
    });
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
    'datasetid': String(req.query.datasetid).split(',')
      .map(function (item) { return parseInt(item, 10); }),
    'siteid': String(req.query.siteid).split(',')
      .map(function (item) { return parseInt(item, 10); }),
    'piid': String(req.query.piid).split(',')
      .map(function (item) { return parseInt(item, 10); }),
    'datasettype': String(req.query.datasettype),
    'altmin': parseInt(String(req.query.altmin)),
    'altmax': parseInt(String(req.query.altmax)),
    'loc': he.decode(String(req.query.loc)),
    'gpid': parseInt(req.query.gpid),
    'ageyoung': parseInt(req.query.ageyoung),
    'ageold': parseInt(req.query.ageold),
    'ageof': parseInt(req.query.ageold),
    'limit': parseInt(req.query.limit),
    'offset': parseInt(req.query.offset)
  };

  outobj = validateOut(outobj);

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        title: 'Oh man.',
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
module.exports.datasetbydb = datasetbydb;
module.exports.datasetsbygeopol = datasetsbygeopol;
