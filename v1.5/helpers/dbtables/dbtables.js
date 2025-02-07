'use strict';

const {sql} = require('../../../src/neotomaapi.js');

const dbtablesQuery = sql('../v1.5/helpers/dbtables/dbtablesQuery.sql');

// Defining the query function:
/**
 * Return the data table based on a set of query parameters
 * @param {req} req A request object passed from Express
 * @param {res} res A response object passed from Express.
 * @param {next} next A next object for Express.
 */
function dbtables(req, res, next) {
  const db = req.app.locals.db;

/**
 * Return information about particular database tables.
 * @param {req} req An express.js `requests` object.
 * @param {res} res An express.js `response` object.
 * @param {next} next An express.js `next` object.
 */
function dbtables(req, res, next) {
  const db = req.app.locals.db;
  /*
  3 cases:
  1: table name passed with or without offset, limit, sort, order, fields:
      --> return set of records
  2: table name and pkey value passed as id:
      --> check if table is single field pkey, if so, return record
  3: no table name passed --> return list of tables
  */
  // handle optional parameters: limit, offset, sort, order, format, fields

  // TODO: can't use CASE to set order by until have table|field lookup function

  // pass properties to template:
  // schemaname, tablename, sortfield, order, offset, limit
  var query;
  let sortField;
  let hasSortField;
  let sortOrder;
  let limit;
  let offset;
  // primitive value, thus assigned by value not by reference
  sortField = sortOrder = limit = offset = null;
  hasSortField = false;

  if (req.query) {
    if (req.query.sort) {
      hasSortField = true;
      if (typeof req.query.sort === 'string') {
        sortField = req.query.sort.toLowerCase();
      }
      sortOrder = 'ASC';
      if (req.query.order && typeof req.query.order === 'string') {
        req.query.order.toLowerCase() == 'd' ? sortOrder = 'DESC' : sortOrder = 'ASC';
      }
    }
    if (req.query.offset) {
      const offsetVal = parseInt(req.query.offset); // returns NaN for " ", "", undefined, null
      if (!isNaN(offsetVal) && offsetVal > 0) {
        offset = offsetVal;
      }
    }
    if (req.query.limit) {
      const limitVal = parseInt(req.query.limit); // returns NaN for " ", "", undefined, null
      if (!isNaN(limitVal) && limitVal > 0) {
        limit = limitVal;
      }
    }
  }
  // TODO: handle case 2
  if (req.params.table) {
    // case 1
    var tableName = req.params.table.toLowerCase();
    // var query = "SELECT * FROM ${schemaname~}.${tablename~}";
    query = dbtablesQuery;
  } else {
    // case 3
    var query = 'SELECT tablename FROM pg_tables WHERE schemaname=\'ndb\';';
  }

  // set query params
  const qryParams = {
    schemaname: 'ndb',
    tablename: tableName,
    sortfield: sortField,
    hasSortField: hasSortField,
    order: sortOrder,
    offset: offset,
    limit: limit,
    spacer: ' ',
  };

  db.any(query, qryParams)
      .then(function(data) {
      // console.log('the dbtables query: ' + query);
        res.status(200)
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved all tables',
            });
      })
      .catch(function(err) {
        next(err);
      });
};

module.exports.dbtables = dbtables;
