// Sites query:
const path = require('path');
// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Set the empty response from the endpoint.  This is for the dataset type.
var emptyReturn = [
  {'site': {
    'siteid': null,
    'sitename': null,
    'sitedescription': null,
    'sitenotes': null,
    'geography': null,
    'altitude': null,
    'collectionunitid': null,
    'collectionunit': null,
    'handle': null,
    'unittype': null},
  'datasets': [{'datasetid': null,
    'datasettype': null,
    'datasetnotes': null,
    'database': null,
    'doi': null,
    'datasetpi': [{'contactid': null,
      'contactname': null,
      'familyname': null,
      'firstname': null,
      'initials': null}],
    'agerange': {'ageyoung': null,
      'ageold': null}
  }]
  }];

const datasetquerysql = sql('./datasetquery.sql');
const datasetbyidsql = sql('./datasetbyid.sql');
const datasetbysite = sql('./datasetbysite.sql');

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

function datasetbyid (req, res, next) {
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = String(req.params.datasetid).split(',').map(function (item) {
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
        var returner = emptyReturn;
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
        var returner = emptyReturn;
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
  var outobj = {'datasetid': String(req.query.datasetid).split(',')
    .map(function (item) { return parseInt(item, 10); }),
  'siteid': String(req.query.siteid).split(',')
    .map(function (item) { return parseInt(item, 10); }),
  'piid': String(req.query.piid).split(',')
    .map(function (item) { return parseInt(item, 10); }),
  'datasettype': String(req.query.sitename),
  'altmin': parseInt(String(req.query.altmin)),
  'altmax': parseInt(String(req.query.altmax)),
  'loc': String(req.query.loc),
  'gpid': parseInt(req.query.gpid),
  'ageyoung': parseInt(req.query.ageyoung),
  'ageold': parseInt(req.query.ageold),
  'ageof': parseInt(req.query.ageold)
  };

  if (typeof req.query.sitename === 'undefined') { outobj.sitename = null }
  if (typeof req.query.altmin === 'undefined') { outobj.altmin = null }
  if (typeof req.query.altmax === 'undefined') { outobj.altmax = null }
  if (typeof req.query.loc === 'undefined') { outobj.loc = null }
  if (typeof req.query.gpid === 'undefined') { outobj.gpid = null }

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

  for (var i in outobj) {
    if (isNaN(outobj[i])) {
      outobj[i] = null;
    }
  };

  db.any(datasetquerysql, outobj)
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = emptyReturn;
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
