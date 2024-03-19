'use strict';
// Spatial queries to HydroLakes on Neotoma:
const {any} = require('bluebird');
const he = require('he');

// Helper for linking to external query files:
const {sql, ifUndef, getparam} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const faunmapQuery = sql('../v2.0/helpers/spatial/faunmap_geom.sql');

/**
 * Return API results for sites when only a string of site IDs is passed in.
 * @param req: The URL request
 * @param res: The response object, to which the response
 *   (200, 404, 500) is sent.
 * @param next: Callback argument to the middleware function
 *   (sends to the `next` function in app.js)
 * @return The function returns nothing, but sends the API result to the client.
 */
function faunmapoverlay(req, res, next) {
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
    let outobj = {
      'sciname': ifUndef(resultSet.sciname, 'int'),
    };
    db.any(faunmapQuery, outobj)
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

module.exports.faunmapoverlay = faunmapoverlay;
