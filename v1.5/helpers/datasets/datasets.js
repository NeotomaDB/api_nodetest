const { sql } = require('../../../src/neotomaapi.js');

const datasetbyidsql = sql('../v1.5/helpers/datasets/datasetbyid.sql');
const datasetsbysitesql = sql('../v1.5/helpers/datasets/datasetbysites.sql');

function datasetbyid (req, res, next) {
  let db = req.app.locals.db
  var datasetid = req.query.datasetid;
  //check if datasetid provided by query or URL slug
  if (!!req.query.datasetid) {
    datasetid = req.query.datasetid;
  } else if (!!req.params.datasetid) {
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

function datasetbyids (req, res, next) {
  let db = req.app.locals.db

  var baddtsid = false;
  var datasetids = [];
  datasetids = String(req.query.datasetids)
    .split(',')
    .map(function(item) {
      if( NaN == parseInt(item)) {
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

function datasetsbysiteid (req, res, next) {
  let db = req.app.locals.db
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

function datasetsbysiteids (req, res, next) {
  let db = req.app.locals.db
  var badstid = false;
  var siteids = [];
  siteids = String(req.query.siteids)
    .split(",")
    .map(function(item) {
      if(NaN == parseInt(item)) {
        badstid = true
        //bad datasetid
        return
      }
      return parseInt(item, 10)
    });

  //check if datasetid is sequence is not valid
  if (badstid) {
    res.status(500)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'Must pass valid datasetids as integer sequence.'
      });
  }

  db.any(datasetsbysitesql, [siteids])
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

function datasetquery (req, res, next) {
  let db = req.app.locals.db
  console.log('Here')
  var datasetid = req.params.datasetid;

  // Get the query string:
  var query = 'SELECT * FROM ndb.datasets as dts WHERE ';

  if (!!datasetid) {
    query = query + 'dts.datasetid = '  + parseInt(datasetid);
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
module.exports.datasetsbysiteids = datasetsbysiteids;
module.exports.datasetquery = datasetquery;
