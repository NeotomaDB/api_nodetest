'use strict';

const {sql} = require('../../../src/neotomaapi.js');

const projectsQuery = sql('../v2.0/helpers/projects/projectsbydataset.sql');

/**
 * Return the projects (and their participants) linked to a dataset.
 * @param {object} req An Express request object.
 * @param {object} res An Express response object.
 * @param {object} next An Express next object.
 */
function projectsbydsid(req, res, next) {
  const db = req.app.locals.db;
  const dsid = parseInt(req.params.datasetid);

  if (!dsid || isNaN(dsid)) {
    return res.status(400).json({
      status: 'failure',
      data: null,
      message: 'A valid integer dataset ID is required.',
    });
  }

  db.oneOrNone(projectsQuery, {datasetid: dsid})
      .then(function(data) {
        res.status(200).json({
          status: 'success',
          data: data ? data.result : {datasetid: dsid, projects: []},
          message: 'Retrieved projects for dataset.',
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

module.exports.projectsbydsid = projectsbydsid;
