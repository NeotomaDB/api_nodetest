import * as promise from 'bluebird'
import pgPromise from 'pg-promise';

const options = {
  // Initialization Options
  promiseLib: promise,
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
}

export let pgp = pgPromise(options);
