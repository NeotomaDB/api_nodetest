'use strict';

const {sql} = require('../../../src/neotomaapi.js');

const assaysQuery = sql('../v2.0/helpers/assays/assaysbydataset.sql');

/**
 * Return the aeDNA assays (and their libraries) linked to a dataset.
 * @param {object} req An Express request object.
 * @param {object} res An Express response object.
 * @param {object} next An Express next object.
 */
function assaysbydsid(req, res, next) {
  const db = req.app.locals.db;
  const dsid = parseInt(req.params.datasetid);

  if (!dsid || isNaN(dsid)) {
    return res.status(400).json({
      status: 'failure',
      data: null,
      message: 'A valid integer dataset ID is required.',
    });
  }

  db.oneOrNone(assaysQuery, {datasetid: dsid})
      .then(function(data) {
        res.status(200).json({
          status: 'success',
          data: data ? data.result : {datasetid: dsid, assays: []},
          message: 'Retrieved aeDNA assays for dataset.',
        });
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'failure',
          message: err.message,
          query: dsid,
        });
      });
}

module.exports.assaysbydsid = assaysbydsid;
