// Sites query:
const path = require('path');
//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
const bib   = require('./../bib_format');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

const datasetbyidsql = sql('./datasetbyid.sql');
//const datasetbysite = sql('./datasetbysite.sql');
const datasetsbysitesql = sql('./datasetbysites.sql');

function datasetbyid(req, res, next) {
  console.log(req.params.datasetid);
  var datasetid = req.query.datasetid;
  //check if datasetid provided by query or URL slug
  if (!!req.query.datasetid){
    datasetid = req.query.datasetid;
  }

  if (!!req.params.datasetid) {
    datasetid = req.params.datasetid;
  } else {
    res.status(500)
        .jsonp({
          success: 0,
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(datasetbyidsql, [datasetid])
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}

function datasetbyids(req, res, next) {
  //console.log(req.query.datasetids);
  var baddtsid = false;
  var datasetids = [];
  datasetids = String(req.query.datasetids)
                      .split(",")
                      .map(function(item){
                        if( NaN == parseInt(item)){
                          baddtsid = true
                          //bad datasetid
                          return
                        }
                        return parseInt(item, 10)
                      });

  //check if datasetid is sequence is not valid
  if (baddtsid) {
    res.status(500)
        .jsonp({
          success: 0,
          status: 'failure',
          data: null,
          message: 'Must pass valid datasetids as integer sequence.'
        });
  }

  console.log("datasetids:"+ JSON.stringify(datasetids));
  db.any(datasetbyidsql, [datasetids])
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
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
        .type('application/json')
        .jsonp({
          status: 'failure',
          data: null,
          message: 'Must pass an integer siteid value.'
        });
  }

  db.any(datasetsbysitesql, [siteid])
    .then(function (data) {
      res.status(200)
        .type('application/json')
        .jsonp({
          success: 1,
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
        .jsonp({
          success: 1,
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
module.exports.datasetbyids = datasetbyids;
module.exports.datasetsbysiteid = datasetsbysiteid;
module.exports.datasetquery = datasetquery;
