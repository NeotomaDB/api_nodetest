'use strict';
// Spatial queries to HydroLakes on Neotoma:
const {any} = require('bluebird');
const he = require('he');

// Helper for linking to external query files:
const {sql, ifUndef, getparam} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const icesheetQuery = sql('../v2.0/helpers/spatial/icesheet_geom.sql');

/**
 * Return API results for sites when only a string of site IDs is passed in.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *   (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware function
 *   (sends to the `next` function in app.js)
 * The function returns nothing, but sends the API result to the client.
 */
function icesheetoverlay(req, res, next) {
  const db = req.app.locals.db;
  const paramGrab = getparam(req);

  if (!paramGrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramGrab.message,
        });
  } else {
    const resultSet = paramGrab.data;
    // Get the input parameters:
    const outobj = {
      'age': ifUndef(resultSet.age, 'int'),
      'prec': ifUndef(resultSet.prec, 'int') || 0.0001,
      'proj': ifUndef(resultSet.proj, 'int') || 4326,
    };
    db.any(icesheetQuery, outobj)
        .then(function(data) {
          res.status(200)
              .json({
                status: 'success',
                data: data,
                message: 'Retrieved all tables',
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
}

module.exports.icesheetoverlay = icesheetoverlay;
