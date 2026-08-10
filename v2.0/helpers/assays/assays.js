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
        // 42P01 "undefined_table" / 42703 "undefined_column". The aeDNA tables are
        // deployed ahead of this route on some hosts, and the FAIRe project columns
        // (sterilise_method, neg_cont, pos_cont) were added to ndb.aednaassays after
        // it shipped — see new_tables.sql in DataBUS_aeDNA. Report "no assays"
        // rather than a server error in either case.
        if (err.code === '42P01' || err.code === '42703') {
          console.warn('aeDNA assay tables are not fully deployed on this host; ' +
                       'returning an empty assay set.');
          return res.status(200).json({
            status: 'success',
            data: {datasetid: dsid, assays: []},
            message: 'aeDNA assay tables are not available on this host.',
          });
        }
        return res.status(500).json({
          status: 'failure',
          message: err.message,
          query: dsid,
        });
      });
}

module.exports.assaysbydsid = assaysbydsid;
