'use strict';
// Returns the data tables:
const {getparam, ifUndef} = require('../../../src/neotomaapi.js');

/**
 * Get a Neotoma table, or metadata about the table:
 * @param {req} req
 * @param {res} res
 * @param {any} next
 */
function dbtables(req, res, next) {
  const db = req.app.locals.db;
  const paramgrab = getparam(req);
  let outobj = {};
  if (!paramgrab.success) {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: paramgrab.message,
        });
  } else {
    const resultset = paramgrab.data;

    outobj = {
      'table': ifUndef(resultset.table, 'string'),
      'count': ifUndef(resultset.count, 'string'),
      'limit': ifUndef(resultset.limit, 'int'),
      'offset': ifUndef(resultset.offset, 'int'),
    };
  }
  let query = '';
  if (outobj.table) {
    outobj.table = 'ndb.' + outobj.table.toLowerCase().replace(/\s/g, '');
    query = 'SELECT * FROM ${table:raw} ' +
            'OFFSET (CASE WHEN ${offset} IS NULL THEN 0 ELSE ${offset} END) ' +
            'LIMIT (CASE WHEN ${limit} IS NULL THEN 25 ELSE ${limit} END)';
    if (outobj.count.toLowerCase() === 'true') {
      query = 'SELECT COUNT(*) FROM ${table:raw};';
    }
  } else {
    query = "SELECT tablename FROM pg_tables WHERE schemaname='ndb';";
  }

  db.any(query, outobj)
      .then(function(data, queryTable) {
        if (outobj.table) {
          data = data;
        } else {
          data = data.map((x) => x.tablename);
        }
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        if (err.message.includes('does not exist')) {
          res.status(200)
              .json({
                status: 'success',
                data: [],
                message: err.message,
              });
        } else {
          res.status(500)
              .json({
                status: 'failure',
                data: err.message,
                message: 'Ran into an error.',
              });
        }
      });
};

module.exports.dbtables = dbtables;
