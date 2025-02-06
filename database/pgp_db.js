'use strict';

const pgPromise = require('pg-promise');

const options = {
  // Initialization Options
  promiseLib: pgPromise.promise,
  capSQL: true,
  query(e) {
    const date = new Date();
    const messageout = {'hasExecuted': e.client.hasExecuted};
    // Exclude the big chunky query:
    if (e.query.match(/CONCAT.*pronamespace = n.oid/)) {
      messageout.query = 'List all functions';
    } else if (e.query.match(/WHERE proname LIKE/)) {
      messageout.query = 'Match function schema';
    } else {
      messageout.query = e.query;
      messageout.db = {
        client: e.client.user,
        database: e.client.database,
        host: e.client.host,
      };
    }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
  },
  error(err, e) {
    const date = new Date();
    // Exclude the big chunky query:
    console.log(JSON.stringify(err));
    const messageout = {'error': JSON.stringify(err), 'query': e.query};
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
  },
};

const pgp = pgPromise(options);

/**
 * Create the database object using the ENV properties.
 * @return {pgp} A pgp object for database connection.
 */
function dbheader() {
  const out = {
    'host': process.env.RDS_HOSTNAME,
    'user': process.env.RDS_USERNAME,
    'database': process.env.RDS_DATABASE,
    'password': process.env.RDS_PASSWORD,
    'port': process.env.RDS_PORT,
    // 'ssl': process.env.SSL_CERT, // Note, change this for AWS.
    'query_timeout': process.env.TIMEOUT,
    'application_name': 'Neotoma API Server',
    'ssl': {
      'rejectUnauthorized': false,
    },
  };
  return pgp(out);
};

module.exports = {'pgp': pgp, 'dbheader': dbheader};
