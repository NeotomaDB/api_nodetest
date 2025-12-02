'use strict';

// Speleothems query:
const he = require('he');

// Helper for linking to external query files:
const {sql, commaSep, getparam, ifUndef} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const speleothembycuid = sql('../v2.0/helpers/speleothems/speleothemsbycuid.sql');

/**
 * Call speleothems by using the CollectionUnit ID.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function speleothemsbycuid(req, res, next) {
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
    const outobj = {
      'collectionunitid': ifUndef(resultset.collectionunitid, 'sep'),
    };
    db.any(speleothembycuid, outobj)
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
                query: paramgrab.data,
              });
        });
  }
}

/**
 * Call speleothems by using the CollectionUnit ID.
 * @param {req} req An Express request object.
 * @param {res} res An Express response object.
 * @param {next} next An Express "next" object.
 */
function speleothemsbydsid(req, res, next) {
  const db = req.app.locals.db;
  // console.log('speleothems', req.params);
  const goodstid = !!req.params.datasetid;
  // console.log('speleothemsbydsid', req.params.datasetid);

  if (goodstid) {
    const dsid = commaSep(req.params.datasetid);
    db.any(speleothembydsid, [dsid])
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
                query: [cuid],
              });
        });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.',
        });
  }
}

// module.exports.speleothemsbycuid = speleothemsbycuid;
module.exports.speleothemsbycuid = speleothemsbycuid;
