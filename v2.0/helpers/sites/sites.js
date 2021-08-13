// Sites query:

var Terraformer = require('terraformer');
var WKT = require('terraformer-wkt-parser');

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {
    minify: true
  });
}

/**
 * Parser for comma separated strings.
 * @param x A comma separated string.
 * @return An array of integers.
 */
function commaSep (x) {
  return String(x).split(',').map(function (item) {
    return parseInt(item, 10);
  });
}

/**
 * Quickly return value or null.
 * @param x Any value passed in from an object.
 * @return either the value of `x` or a `null` value.
 */
function ifUndef (x, opr) {
  if (typeof x === 'undefined') {
    return null;
  } else {
    switch (opr) {
      case 'string':
        return String(x);
      case 'sep':
        return commaSep(x);
      case 'int':
        return parseInt(x, 10);
    }
  }
}

// Create a QueryFile globally, once per file:
const siteQuery = sql('./sitequery.sql');
const sitebydsid = sql('./sitebydsid.sql');
const sitebyid = sql('./sitebyid.sql');
const sitebygpid = sql('./sitebygpid.sql');
const sitebyctid = sql('./sitebyctid.sql');

/**
 * Return API results for sites when only a string of site IDs is passed in.
 * @param req The URL request
 * @param res The response object, to which the response (200, 404, 500) is sent.
 * @param next Callback argument to the middleware function (sends to the `next` function in app.js)
 * @return The function returns nothing, but sends the API result to the client.
 */
function sitesbyid (req, res, next) {
  var goodstid = !!req.params.siteid;

  if (goodstid) {
    var siteid = commaSep(req.params.siteid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(sitebyid, [siteid])
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
    })
}

/**
 * Return API results for sites when a set of parameters are passed in.
 * @param req The URL request
 * @param res The response object, to which the response (200, 404, 500) is sent.
 * @param next Callback argument to the middleware function (sends to the `next` function in app.js)
 * @return The function returns nothing, but sends the API result to the client.
 */
function sitesquery (req, res, next) {
  // Get the input parameters:
  var outobj = {
    'sitename': ifUndef(req.query.sitename, 'string'),
    'siteid': ifUndef(req.query.siteid, 'sep'),
    'altmin': ifUndef(req.query.altmin, 'int'),
    'altmax': ifUndef(req.query.altmax, 'int'),
    'loc': ifUndef(req.query.loc, 'string'),
    'gpid': ifUndef(req.query.gpid, 'sep'),
    'offset': ifUndef(req.query.offset, 'int'),
    'limit': ifUndef(req.query.limit, 'int')
  };

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    return res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });
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

  db.any(siteQuery, outobj)
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

function sitesbydataset (req, res, next) {
  var gooddsid = !!req.params.datasetid;

  if (gooddsid) {
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

  db.any(sitebydsid, [datasetid])
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

function sitesbygeopol (req, res, next) {
  var goodgp = !!req.params.gpid;

  if (goodgp) {
    var gpid = { gpid: commaSep(req.params.gpid) };
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  if (!!req.query.limit) {
    gpid.limit = req.query.limit
  } else {
    gpid.limit = 25
  }

  if (!!req.query.offset) {
    gpid.offset = req.query.offset
  } else {
    gpid.offset = 25
  }

  db.any(sitebygpid, gpid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          query: gpid,
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function sitesbycontact (req, res, next) {
  var goodctc = !!req.params.contactid

  if (goodctc) {
    var contactid = String(req.params.contactid).split(',').map(function (item) {
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

  db.any(sitebyctid, [contactid])
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

module.exports.sitesbyid = sitesbyid;
module.exports.sitesquery = sitesquery;
module.exports.sitesbydataset = sitesbydataset;
module.exports.sitesbygeopol = sitesbygeopol;
module.exports.sitesbycontact = sitesbycontact;
