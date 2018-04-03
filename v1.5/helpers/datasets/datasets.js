// Sites query:
const path = require('path');
//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;
const bib   = require('./../bib_format');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

const datasetbyidsql = sql('./datasetbyid.sql');
//const datasetbysite = sql('./datasetbysite.sql');
const datasetsbysitesql = sql('./datasetbysite.sql');

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


function datasetsbysiteid(req, res, next) {
  console.log("called datasetsbysiteid");
  console.log("req.params.siteid: "+req.params.siteid);
  console.log("req.query.siteid: "+req.query.siteid);
  
  //check if valid integer siteid
  var siteid = +req.query.siteid;

  if (isNaN(siteid)) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass an integer siteid value.'
        });
  }

  db.any(datasetsbysitesql, [siteid])
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


function datasetquery(req, res, next) {
  
  var datasetid = req.params.datasetid;

  // Get the query string:
  var query = 'SELECT * FROM ndb.datasets as dts WHERE ';

  if (!!datasetid) {
    query = query + 'dts.datasetid = '  + datasetid;
  }

  db.any(query)
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

module.exports.datasetbyid = datasetbyid;
module.exports.datasetsbysiteid = datasetsbysiteid;
module.exports.datasetquery = datasetquery;
