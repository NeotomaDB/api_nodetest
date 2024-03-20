'use strict';
const {sql} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
// const gpuQuery = sql('../v1.5/helpers/geopoliticalunts/gpuQuery.sql');
const gpuid = sql('../v1.5/helpers/geopoliticalunits/gpubyid.sql');

/**
 * Return a geopolitical identifier using the internal Neotoma GPID.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express next object.
 */
function geopoliticalbyid(req, res, next) {
  const db = req.app.locals.db;
  let gpid = [];
  if (!!req.params.gpid) {
    gpid = String(req.params.gpid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(400)
        .json({
          success: 0,
          status: 'failure',
          data: null,
        });
  };

  db.any(gpuid, [gpid])
      .then(function(data) {
        let returner = [{'geopoliticalid': null,
          'highergeopoliticalid': null,
          'rank': null,
          'geopoliticalunit': null,
          'geopoliticalname': null,
          'higher': null,
          'lower': null,
          'recdatecreated': null,
          'recdatemodified': null}];
        if (data.length > 0) {
          returner = data.sort(function(obj1, obj2) {
            return obj1.Rank - obj2.Rank;
          });
        }
        res.status(200)
            .json({
              success: 1,
              status: 'success',
              data: returner,
            });
      })
      .catch(function(err) {
        return next(err);
      });
}

/**
 * Return information about geopolitical units based on rank level.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express next object.
 */
function geopoliticalunits(req, res, next) {
  const db = req.app.locals.db;
  /*
  Geopolitical units work this way:
    Can pass a string or identifier to figure out names & IDs.
      - Not really sure why this is important. . .
    Should be able to pass in site IDs, or dataset IDs to then figure out
      where the records are, with regards to political units.
  */

  let querySQL;
  let gpID;

  if (!req.query.hasOwnProperty('id')) {
    // no id passed, return top level geopoliticalunits
    querySQL = 'select geopoliticalid, ' +
      'geopoliticalname from da.geopoliticalunits where rank = 1';
    db.any(querySQL)
        .then(function(data) {
          res.status(200)
              .jsonp({
                success: 1,
                status: 'success',
                data: data,
              });
        })
        .catch(function(err) {
          return next(err);
        });
  } else {
    gpID = String(req.query.id).split(',').map(function(item) {
      return parseInt(item, 10);
    });
    if (!isNaN(gpID[0])) {
      querySQL = 'select geopoliticalid, ' +
        'geopoliticalname ' +
        'from da.geopoliticalunits where highergeopoliticalid = $1';
      db.any(querySQL, gpID)
          .then(function(data) {
            res.status(200)
                .jsonp({
                  success: 1,
                  status: 'success',
                  data: data,
                });
          })
          .catch(function(err) {
            return next(err);
          });
    } else {
      querySQL = 'select geopoliticalid, ' +
        'geopoliticalname from da.geopoliticalunits';
      db.any(querySQL)
          .then(function(data) {
            res.status(200)
                .jsonp({
                  success: 1,
                  status: 'success',
                  data: data,
                });
          })
          .catch(function(err) {
            return next(err);
          });
    }
  }
}

module.exports.geopoliticalunits = geopoliticalunits;
module.exports.geopoliticalbyid = geopoliticalbyid;
