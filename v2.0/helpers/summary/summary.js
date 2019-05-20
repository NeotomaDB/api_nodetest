// Sites query:
const path = require('path');
// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
var validate = require('../validateOut').validateOut

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

const datasetquerysql = sql('./datasetquery.sql');
const datasetbyidsql = sql('./datasetbyid.sql');
const datasetbysite = sql('./datasetbysite.sql');

function datasettypesbymonths (req, res, next) {
  var start = parseInt(req.query.start);
  var end = parseInt(req.query.end);

  console.log(req);

  var query = "SELECT * FROM ndb.datasettypecontrib(${start}::int, ${end}::int)"

  db.any(query, {start: start, end: end})
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {

        returner = {query: {call: 'dataset types', start: start, end: end},
                    data: data};

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

function rawbymonth (req, res, next) {
  var start = parseInt(req.query.start);
  var end = parseInt(req.query.end);

  var query = "SELECT * FROM ndb.rawbymonth(${start}::int, ${end}::int)"

  db.any(query, {start: start, end: end})
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {

        returner = {query: {call: 'summary', start: start, end: end},
                    data: data};

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

function datasetdbsbymonths (req, res, next) {
  var start = parseInt(req.query.start);
  var end = parseInt(req.query.end);

  console.log(req);

  var query = "SELECT * FROM ndb.datasetconstitdb(${start}::int, ${end}::int)"

  db.any(query, {start: start, end: end})
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {

        returner = {query: {call: 'dataset types', start: start, end: end},
                    data: data};

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

module.exports.datasettypesbymonths = datasettypesbymonths;
module.exports.datasetdbsbymonths = datasetdbsbymonths;
module.exports.rawbymonth = rawbymonth;
