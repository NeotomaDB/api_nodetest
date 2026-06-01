'use strict';

const {sql} = require('../../../src/neotomaapi.js');

const sequencesQuery = sql('../v2.0/helpers/aedna/sequences.sql');
const sequencesByTaxonQuery = sql('../v2.0/helpers/aedna/sequencesbytaxon.sql');

/**
 * Return aeDNA sequences for a dataset, with taxon assignment and model info.
 * @param {object} req An Express request object.
 * @param {object} res An Express response object.
 * @param {object} next An Express next object.
 */
function sequencesbydsid(req, res, next) {
  const db = req.app.locals.db;
  const dsid = parseInt(req.params.datasetid);

  if (!dsid || isNaN(dsid)) {
    return res.status(400).json({
      status: 'failure',
      data: null,
      message: 'A valid integer dataset ID is required.',
    });
  }

  db.oneOrNone(sequencesQuery, {datasetid: dsid})
      .then(function(data) {
        res.status(200).json({
          status: 'success',
          data: data ? data.result : {datasetid: dsid, sequences: []},
          message: 'Retrieved aeDNA sequences for dataset.',
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

function sequencesbytaxonid(req, res, next) {
  const db = req.app.locals.db;
  const txid = parseInt(req.params.taxonid);

  if (!txid || isNaN(txid)) {
    return res.status(400).json({
      status: 'failure',
      data: null,
      message: 'A valid integer taxon ID is required.',
    });
  }

  db.any(sequencesByTaxonQuery, {taxonid: txid})
      .then(function(data) {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved aeDNA sequences for taxon.',
        });
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'failure',
          message: err.message,
          query: txid,
        });
      });
}

module.exports.sequencesbydsid = sequencesbydsid;
module.exports.sequencesbytaxonid = sequencesbytaxonid;
