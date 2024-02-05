'use strict';

const {validateOut} = require('../../../src/neotomaapi.js');

/**
 * Generate a JSON object with dataset types by month.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function datasettypesbymonths(req, res, next) {
  const db = req.app.locals.db;
  let outobj = {'start': parseInt(req.query.start || 0, 10),
    'end': parseInt(req.query.end || 1, 10)};

  outobj = validateOut(outobj);

  const query = `SELECT * 
    FROM ndb.datasettypecontrib(${outobj.start}::int, ${outobj.end}::int)`;

  db.any(query, outobj)
      .then(function(data) {
        let returner = [];
        if (data.length !== 0) {
          returner = {
            query: outobj,
            data: data,
          };
        };
        res.status(200)
            .json(
                {
                  status: 'success',
                  data: returner,
                  message: 'Retrieved all tables',
                });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
              message: 'Must pass either queries or a comma separated integer sequence.',
            });
      });
}

/**
 * Generate a JSON object with the count of datasets, sites &cetera by month.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function rawbymonth(req, res, next) {
  const db = req.app.locals.db;
  let outobj = {'start': parseInt(req.query.start || 0, 10),
    'end': parseInt(req.query.end || 1, 10)};

  outobj = validateOut(outobj);

  const query = `SELECT * 
    FROM ndb.rawbymonth(${outobj.start}::int, ${outobj.end}::int)`;

  db.any(query, outobj)
      .then(function(data) {
        let returner = [];
        if (data.length !== 0) {
          returner = {
            query: outobj,
            data: data,
          };
        };
        res.status(200)
            .json(
                {
                  status: 'success',
                  data: returner,
                  message: 'Retrieved all tables',
                });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
              message: 'Must pass either queries or a comma separated integer sequence.',
            });
      });
}

/**
 * Generate a JSON object with dataset types by month.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function datasetdbsbymonths(req, res, next) {
  const db = req.app.locals.db;
  let outobj = {'start': parseInt(req.query.start || 0, 10),
    'end': parseInt(req.query.end || 1, 10)};

  outobj = validateOut(outobj);

  const query = `SELECT * 
    FROM ndb.datasetconstitdb(${outobj.start}::int,${outobj.end}::int)`;

  db.any(query, outobj)
      .then(function(data) {
        let returner = [];
        if (data.length !== 0) {
          returner = {
            query: outobj,
            data: data,
          };
        };
        res.status(200)
            .json(
                {
                  status: 'success',
                  data: returner,
                  message: 'Retrieved all tables',
                });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
              message: 'Must pass either queries or a comma separated integer sequence.',
            });
      });
}

/**
 * Generate daily values from ap.summaries.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function sparklines(req, res, next) {
  const db = req.app.locals.db;
  let outobj = {'start': parseInt(req.query.start || 0, 10),
    'end': parseInt(req.query.end || 1, 10)};

  outobj = validateOut(outobj);

  const query = `SELECT *
               FROM ap.summaries 
               WHERE dbdate < current_date - interval '${outobj.start}' day
                 AND dbdate > current_date - interval '${outobj.end}' day`;

  db.any(query, outobj)
      .then(function(data) {
        let returner = [];
        if (data.length !== 0) {
          returner = {
            query: outobj,
            data: data,
          };
        };
        res.status(200)
            .json(
                {
                  status: 'success',
                  data: returner,
                  message: 'Retrieved all tables',
                });
      })
      .catch(function(err) {
        res.status(500)
            .json({
              status: 'failure',
              data: err.message,
              message: 'Must pass either queries or a comma separated integer sequence.',
            });
      });
}

module.exports.datasettypesbymonths = datasettypesbymonths;
module.exports.datasetdbsbymonths = datasetdbsbymonths;
module.exports.rawbymonth = rawbymonth;
module.exports.sparklines = sparklines;
