// get global database object
const db = require('../../database/pgp_db');
const pgp = db.$config.pgp;

module.exports = {
  ndbtable: getNDBtable,
  tablenames: tablenames
};

// Defining the query functions:

/* All the Endpoint functions */

function getNDBtable (req, res, next) {
  if (req.query.table) {
    var table = new pgp.helpers.TableName({ table: req.query.table, schema: 'ndb' });
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass a table name parameter to the API.'
      });
  }

  if (req.query.limit) {
    var limit = parseInt(req.query.limit);
  } else {
    limit = 25;
  }

  if (req.query.offset) {
    var offset = parseInt(req.query.offset);
  } else {
    offset = 0;
  }

  db.query('SELECT * FROM $1 LIMIT $2 OFFSET $3;', [table, limit, offset])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: { limit: limit, offset: offset, data: data },
          message: 'Retrieved rows from ' + req.query.table
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}

function tablenames (req, res, next) {
  db.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname='ndb';")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data.map(x => x['tablename']).sort(),
          message: 'Retrieved all tablenames for Neotoma.'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message
        });
    });
}
