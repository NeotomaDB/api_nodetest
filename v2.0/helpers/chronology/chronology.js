// Chroncontrol query:
// Should return the chron controls and also the geochron data.

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

/* A function to remove null elements. */
const { sql, commaSep, ifUndef, removeEmpty } = require('../../../src/neotomaapi.js');

const chronologybyidsql = sql('../v2.0/helpers/chronology/chronologybyid.sql');
const chronologybydsidsql = sql('../v2.0/helpers/chronology/chronologybydsid.sql');
const chronologybystidsql = sql('../v2.0/helpers/chronology/chronologybystid.sql');

function chronologybyid (req, res, next) {
  if (!(req.params.chronologyid == null)) {
    var chronologyid = String(req.params.chronologyid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  };

  db.any(chronologybyidsql, [chronologyid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function chronologybydsid (req, res, next) {
  if (!(req.params.datasetid == null)) {
    var datasetid = String(req.params.datasetid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  };

  /* The query returns a big long table. */

  db.any(chronologybydsidsql, [datasetid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function chronologybystid (req, res, next) {
  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or an integer sequence.'
      });
  };
  
  db.any(chronologybystidsql, [siteid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

module.exports.chronologybyid = chronologybyid;
module.exports.chronologybydsid = chronologybydsid;
module.exports.chronologybystid = chronologybystid;
