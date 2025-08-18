// Queries to support landing page rendering.
'use strict';

const {any} = require('bluebird');

// Helper for linking to external query files:
const {sql, ifUndef, getparam, checkCookies} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const datasetsum = sql('../v2.0/helpers/landing/datasetsummary.sql');
const dscontrib = sql('../v2.0/helpers/landing/dbcontribmonth.sql');
const dsages = sql('../v2.0/helpers/landing/dsagerangesbydb.sql');
const dbsum = sql('../v2.0/helpers/landing/dbsummary.sql');
const contactOrcid = sql('../v2.0/helpers/landing/contact_orcid.sql');
const orcidContact = sql('../v2.0/helpers/landing/contacts_by_orcid.sql');
const contactDatasets = sql('../v2.0/helpers/landing/contactdatasets.sql');

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
    res.format({
      'application/json': function() {
        res.status(500)
            .json({
              status: 'failure',
              data: null,
              message: paramgrab.message,
            });
      },
      'text/plain': function() {
        res.status(500)
            .send('failure: ' + paramgrab.message);
      },
    });
  } else {
    const resultset = paramgrab.data;

    // Get the input parameters:
    const outobj = {
      'dbid': ifUndef(resultset.dbid, 'int'),
    };

    db.any(dsages, outobj)
        .then(function(data) {
          res.format({
            'application/json': function() {
              res.status(200)
                  .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all datasets',
                    query: outobj,
                  });
            },
            'text/csv': function() {
              res.status(200)
                  .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all datasets',
                    query: outobj,
                  });
            }
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

/**
 * Return API results for datasets based on constituent database.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function databasesummaries(req, res, next) {
  const db = req.app.locals.db;
  const paramgrab = getparam(req);

  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  }

  const resultset = paramgrab.data;

  // Get the input parameters:
  const outobj = {
    'dbid': ifUndef(resultset.dbid, 'int'),
  };

  db.any(dbsum, outobj)
      .then(function(data) {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved all datasets',
              query: null,
            });
      })
      .catch(function(err) {
        return res.status(500)
            .json({
              status: 'failure',
              message: err.message,
              query: null,
            });
      });
};


/**
 * Return contact ORCIDs based on the contact ID.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function orcid_by_contact_id(req, res, next) {
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
      'contactid': ifUndef(resultset.contactid, 'int'),
    };
    db.any(contactOrcid, outobj)
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
 * Return contact ORCIDs based on the contact ID.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function contact_by_orcid_id(req, res, next) {
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
      'orcid': ifUndef(resultset.orcid, 'string'),
    };
    db.any(orcidContact, outobj)
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
 * Return contact ORCIDs based on the contact ID.
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
function datasetsByContact(req, res, next) {
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
      'contactid': ifUndef(resultset.contactid, 'int'),
    };
    db.any(contactDatasets, outobj)
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
 * Return spatial components from NativeLands using their API.
 * @async
 * @param {req} req The URL request
 * @param {res} res The response object, to which the response
 *  (200, 404, 500) is sent.
 * @param {next} next Callback argument to the middleware
 *  function (sends to the `next` function in app.js)
 */
const sendNativeLands = async function(req, res, next) {
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
      'position': ifUndef(resultset.lat, 'int') + ',' + ifUndef(resultset.long, 'int'),
      'key': process.env.NATIVELANDKEY,
      'maps': 'territories',
    };
    const searchParams = new URLSearchParams(outobj)
    const maps = await fetch(`https://native-land.ca/api/index.php?${searchParams}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Neotoma Paleoecology Database API',
      },
    });
    if (!maps.ok) {
      res.status(500)
          .json({
            status: 'failure',
            data: null,
            message: maps.error,
          });
    }
    const natland = await maps.json();
    res.status(200)
        .json({
          status: 'success',
          data: natland,
          message: 'Retrieved all datasets',
          query: outobj,
        });
  };
};


module.exports.datasetbydbid = datasetbydbid;
module.exports.dsuploadagg = dsuploadagg;
module.exports.datasetagesbydbid = datasetagesbydbid;
module.exports.databasesummaries = databasesummaries;
module.exports.orcid_by_contact_id = orcid_by_contact_id;
module.exports.contact_by_orcid_id = contact_by_orcid_id;
module.exports.datasetsByContact = datasetsByContact;
module.exports.sendNativeLands = sendNativeLands;
