const { validateOut } = require('../../../src/neotomaapi.js');

function datasettypesbymonths (req, res, next) {
  let db = req.app.locals.db
  var outobj = { 'start': parseInt(req.query.start || 0),
    'end': parseInt(req.query.end || 1) }

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
    });
}

function rawbymonth (req, res, next) {
  let db = req.app.locals.db
  var outobj = { 'start': parseInt(req.query.start || 0), 
    'end': parseInt(req.query.end || 1) }

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
    });
}

function datasetdbsbymonths (req, res, next) {
  let db = req.app.locals.db
  var outobj = { 'start': parseInt(req.query.start || 0),
    'end': parseInt(req.query.end || 1) }

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
    });
}

function sparklines (req, res, next) {
  let db = req.app.locals.db
  var outobj = { 'start': parseInt(req.query.start || 0),
    'end': parseInt(req.query.end || 1) }

  outobj = validateOut(outobj);

  var query = `SELECT *
               FROM ap.summaries 
               WHERE dbdate < current_date - interval '${outobj.start}' day
                 AND dbdate > current_date - interval '${outobj.end}' day`

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
    });
}

module.exports.datasettypesbymonths = datasettypesbymonths;
module.exports.datasetdbsbymonths = datasetdbsbymonths;
module.exports.rawbymonth = rawbymonth;
module.exports.sparklines = sparklines;
