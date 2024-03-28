// Queries to support landing page rendering.
'use strict';
const {any} = require('bluebird');
const he = require('he');

// Helper for linking to external query files:
const {sql,
  commaSep,
  ifUndef,
  checkObject,
  getparam,
  parseLocations} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const datasetsum = sql('../v2.0/helpers/landing/datasetsummary.sql');
const dscontrib = sql('../v2.0/helpers/landing/dbcontribmonth.sql');
const dsages = sql('../v2.0/helpers/landing/dsagerangesbydb.sql');

/**
 * Return API results for datasets based on constituent database.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function datasetbydbid(req, res, next) {
  const db = req.app.locals.db;
  const paramgrab = getparam(req);

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    const resultset = paramgrab.data;

    // Get the input parameters:
    const outobj = {
      'dbid': ifUndef(resultset.dbid, 'int'),
    };

    db.any(datasetsum, outobj)
        .then(function(data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all datasets',
                query: outobj,
              });
        })
        .catch(function(err) {
          return res.status(500)
              .json({
                status: 'failure',
                message: err.message,
                query: outobj,
              });
        });
  }
};

/**
 * Return age bounds for datasets based on constituent database.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function datasetagesbydbid(req, res, next) {
  const db = req.app.locals.db;
  const paramgrab = getparam(req);

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    const resultset = paramgrab.data;

    // Get the input parameters:
    const outobj = {
      'dbid': ifUndef(resultset.dbid, 'int'),
    };

    db.any(dsages, outobj)
        .then(function(data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all datasets',
                query: outobj,
              });
        })
        .catch(function(err) {
          return res.status(500)
              .json({
                status: 'failure',
                message: err.message,
                query: outobj,
              });
        });
  }
};

/**
 * Return the number of datasets uploaded by day, for a particular database.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function dsuploadagg(req, res, next) {
  const db = req.app.locals.db;
  const paramgrab = getparam(req);

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    const resultset = paramgrab.data;

    // Get the input parameters:
    const outobj = {
      'dbid': ifUndef(resultset.dbid, 'int'),
    };

    db.any(dscontrib, outobj)
        .then(function(data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all datasets',
                query: outobj,
              });
        })
        .catch(function(err) {
          return res.status(500)
              .json({
                status: 'failure',
                message: err.message,
                query: outobj,
              });
        });
  }
};

module.exports.datasetbydbid = datasetbydbid;
module.exports.dsuploadagg = dsuploadagg;
module.exports.datasetagesbydbid = datasetagesbydbid;
