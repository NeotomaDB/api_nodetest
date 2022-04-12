// get global database object
var db = require('../../../database/pgp_db');

const { validateOut } = require('../../../src/neotomaapi.js');

function datasettypesbymonths (req, res, next) {
  var outobj = { 'start': parseInt(req.query.start ?? 0),
  'end': parseInt(req.query.end ?? 1) }

  outobj = validateOut(outobj);

  var query = `SELECT * FROM ndb.datasettypecontrib(${outobj.start}::int, ${outobj.end}::int)`

  db.any(query, outobj)
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = {
          query: outobj,
          data: data
        };
      };
      res.status(200)
        .json(
          {
            status: 'success',
            data: returner,
            message: 'Retrieved all tables'
          });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next.err()
    });
}

function rawbymonth (req, res, next) {
  var outobj = { 'start': parseInt(req.query.start ?? 0),
  'end': parseInt(req.query.end ?? 1) }

  outobj = validateOut(outobj);

  var query = `SELECT * FROM ndb.rawbymonth(${outobj.start}::int, ${outobj.end}::int)`

  db.any(query, outobj)
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = {
          query: outobj,
          data: data
        };
      };
      res.status(200)
        .json(
          {
            status: 'success',
            data: returner,
            message: 'Retrieved all tables'
          });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next.err()
    });
}

function datasetdbsbymonths (req, res, next) {
  var outobj = { 'start': parseInt(req.query.start ?? 0),
    'end': parseInt(req.query.end ?? 1) }

  outobj = validateOut(outobj);

  var query = `SELECT * FROM ndb.datasetconstitdb(${outobj.start}::int,${outobj.end}::int)`

  db.any(query, outobj)
    .then(function (data) {
      if (data.length === 0) {
        // We're returning the structure, but nothing inside it:
        var returner = [];
      } else {
        returner = {
          query: outobj,
          data: data
        };
      };
      res.status(200)
        .json(
          {
            status: 'success',
            data: returner,
            message: 'Retrieved all tables'
          });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
      next.err()
    });
}

module.exports.datasettypesbymonths = datasettypesbymonths;
module.exports.datasetdbsbymonths = datasetdbsbymonths;
module.exports.rawbymonth = rawbymonth;
