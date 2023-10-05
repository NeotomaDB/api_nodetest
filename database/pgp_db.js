let pgPromise = require('pg-promise');
let promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: pgPromise.promise,
  capSQL: true,
  query (e) {
    var date = new Date()
    var messageout = { 'hasExecuted': e.client.hasExecuted }
    // Exclude the big chunky query:
    if (e.query.match(/CONCAT.*pronamespace = n.oid/)) {
      messageout.query = 'List all functions'
    } else if (e.query.match(/WHERE proname LIKE/)) {
      messageout.query = 'Match function schema'
    } else {
      messageout.query = e.query
      messageout.db = { client: e.client.user, database: e.client.database, host: e.client.host }
    }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout))
  },
  error (err, e) {
    var date = new Date()
    // Exclude the big chunky query:
    console.log(JSON.stringify(err))
    var messageout = { 'error': JSON.stringify(err), 'query': e.query }
    //messageout.db = { 'client': e.client.user, 'database': e.client.database, 'host': e.client.host }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout))
  }
};

let pgp = pgPromise(options);

function dbheader () {
  var out = {
    'host': process.env.RDS_HOSTNAME,
    'user': process.env.RDS_USERNAME,
    'database': process.env.RDS_DATABASE,
    'password': process.env.RDS_PASSWORD,
    'port': process.env.RDS_PORT,
    'ssl': false, // Note, change this for AWS.
    'query_timeout': 3000
  }
  return pgp(out)
};

module.exports = { 'pgp': pgp, 'dbheader': dbheader }