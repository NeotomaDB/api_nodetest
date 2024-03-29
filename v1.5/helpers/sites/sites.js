const { sql } = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const siteQuery = sql('../v1.5/helpers/sites/sitequery.sql');
const sitebydsid = sql('../v1.5/helpers/sites/sitebydsid.sql');
const sitebyid = sql('../v1.5/helpers/sites/sitebyid.sql');
const sitebygpid = sql('../v1.5/helpers/sites/sitebygpid.sql');

function sitesbyid(req, res, next) {
  let db = req.app.locals.db
  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

  } else {
    res.status(500)
      .json({
        success: 0,
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  }

  db.any(sitebyid, [siteid])
    .then(function (data) {
      res.status(200)
        .json({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}


function sitesquery(req, res, next) {
  let db = req.app.locals.db
  // Get the input parameters:
  var outobj = {'sitename':String(req.query.sitename),
    'siteid': parseInt(String(req.query.siteid)),
    'altmin':parseInt(String(req.query.altmin)),
    'altmax':parseInt(String(req.query.altmax)),
    'loc':String(req.query.loc),
    'gpid':parseInt(req.query.gpid)
  };

  if (typeof req.query.sitename === 'undefined') { outobj.sitename = null }
  if (typeof req.query.siteid === 'undefined')   { outobj.siteid = null }
  if (typeof req.query.altmin === 'undefined')   {   outobj.altmin = null }
  if (typeof req.query.altmax === 'undefined')   {   outobj.altmax = null }
  if (typeof req.query.loc === 'undefined')      {      outobj.loc = null }
  if (typeof req.query.gpid === 'undefined')     {     outobj.gpid = null }

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });
  }

  db.any(siteQuery, outobj)
    .then(function (data) {
      res.status(200)
        .json({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function sitesbydataset(req, res, next) {
  let db = req.app.locals.db
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

  db.any(sitebydsid, [datasetid])
    .then(function (data) {
      res.status(200)
        .json({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function sitesbygeopol(req, res, next) {
  let db = req.app.locals.db
  if (!!req.params.gpid) {
    var gpid = String(req.params.gpid).split(',').map(function(item) {
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

  db.any(sitebygpid, [gpid])
    .then(function (data) {
      res.status(200)
        .json({
          success: 1,
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
