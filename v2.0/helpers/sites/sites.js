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
 const siteQuery = sql('./sitequery.sql');
const sitebydsid = sql('./sitebydsid.sql');
  const sitebyid = sql('./sitebyid.sql');
const sitebygpid = sql('./sitebygpid.sql');
const sitebyctid = sql('./sitebyctid.sql');

function sitesbyid (req, res, next) {

  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
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

function sitesquery(req, res, next) {

  // Get the input parameters:
  var outobj = {'sitename':String(req.query.sitename),
                  'altmin':parseInt(String(req.query.altmin)),
                  'altmax':parseInt(String(req.query.altmax)),
                     'loc':String(req.query.loc),
                    'gpid':parseInt(req.query.gpid)
               };

  if (typeof req.query.sitename === 'undefined') { outobj.sitename = null }
  if (typeof req.query.altmin === 'undefined')   {   outobj.altmin = null }
  if (typeof req.query.altmax === 'undefined')   {   outobj.altmax = null }
  if (typeof req.query.loc === 'undefined')      {      outobj.loc = null }
  if (typeof req.query.gpid === 'undefined')     {     outobj.gpid = null }

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    return res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      }); 
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

function sitesbydataset(req, res, next) {

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
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
        return next(err);
    });
}

function sitesbycontact(req, res, next) {

  if (!!req.params.contactid) {
    var contactid = String(req.params.contactid).split(',').map(function(item) {
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