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

const datasetquerysql = sql('./datasetquery.sql');
const datasetbyidsql = sql('./datasetbyid.sql');
const datasetbysite = sql('./datasetbysite.sql');

function datasetbyid(req, res, next) {
  console.log(req.params.datasetid);

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

  db.any(datasetbyidsql, [datasetid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function datasetbysiteid(req, res, next) {
  console.log(req.params.siteid);

  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
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
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function datasetquery (req, res, next) {

  // Get the input parameters:
  var outobj = {'siteid':String(req.query.siteid).split(',').map(function(item) {
                            return parseInt(item, 10);
                          }),
                'piid':String(req.query.piid).split(',').map(function(item) {
                            return parseInt(item, 10);
                          }),
                'datasettype': String(req.query.sitename),
                     'altmin': parseInt(String(req.query.altmin)),
                     'altmax': parseInt(String(req.query.altmax)),
                        'loc': String(req.query.loc),
                       'gpid': parseInt(req.query.gpid),
                   'ageyoung': parseInt(req.query.ageyoung),
                     'ageold': parseInt(req.query.ageold),
                      'ageof': parseInt(req.query.ageold),
                  'datasetid': String(req.query.datasetid).split(',')
    .map(function (item) {
      return parseInt(item, 10);
    })
  };

  if (typeof req.query.sitename === 'undefined') { outobj.sitename = null }
  if (typeof req.query.altmin === 'undefined')   {   outobj.altmin = null }
  if (typeof req.query.altmax === 'undefined')   {   outobj.altmax = null }
  if (typeof req.query.loc === 'undefined')      {      outobj.loc = null }
  if (typeof req.query.gpid === 'undefined')     {     outobj.gpid = null }

  console.log(outobj);

  if (outobj.altmin > outobj.altmax & !!outobj.altmax & !!outobj.altmin) {
    res.status(500)
      .json({
        status: 'failure',
        message: 'The altmin is greater than altmax.  Please fix this!'
      });
  }

  console.log(typeof outobj);

  for (var i in outobj) {
    if (isNaN(outobj[i])) {
      outobj[i] = null;
    }
  };

  console.log(outobj);

  db.any(datasetquerysql, outobj)
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

module.exports.datasetbyid = datasetbyid;
module.exports.datasetbysiteid = datasetbysiteid;
module.exports.datasetquery = datasetquery;
