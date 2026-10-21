'use strict';
// Decides which session a successful ORCID login gets.
//
// This used to be "INSERT a new row every time", so anyone who didn't click Logout
// (or who logged in from a second tab or device) left another working 7-day key
// behind in ap.orcidlogins. Every live sessionuuid is a bearer credential, so the
// rule now is: one live session per ORCID iD.
//
//   - A live session with more than 24h left is handed back as it is. No new key,
//     and its expiry is not extended.
//   - Otherwise (none, or about to expire) every live session for that iD is
//     expired and one new session is minted.
//   - On either path any other live sessions for the iD are expired, which also
//     tidies up duplicates that already exist.
//
// It all runs in one transaction behind an advisory lock on the ORCID iD. Without
// the lock two simultaneous logins (a double click, two tabs) would both find
// nothing and both insert.

const {sql} = require('../../../src/neotomaapi.js');

const findactivelogin = sql('../v2.0/helpers/validation/findactivelogin.sql');
const expireotherlogins = sql('../v2.0/helpers/validation/expireotherlogins.sql');
const insertuserlogin = sql('../v2.0/helpers/validation/newlogin.sql');

// Two-key form so this lock can't collide with an advisory lock taken elsewhere
// for an unrelated purpose that happens to hash to the same integer.
const LOCKSQL = 'SELECT pg_advisory_xact_lock(hashtext(\'ap.orcidlogins\'), ' +
  'hashtext($1))';

/**
 * Get the session an ORCID iD should use, reusing a live one when possible.
 * @param {object} db A pg-promise database object.
 * @param {object} login The login details.
 * @param {string} login.orcidid The full ORCID iD, as stored in ap.orcidlogins.
 * @param {string} login.ipaddr The IP address the login came from.
 * @param {string|null} login.orcidname The person's name, for the new row only.
 * @return {Promise<object>} {sessionuuid, expiresat, reused}
 * **/
async function getOrCreateSession(db, {orcidid, ipaddr, orcidname}) {
  return db.tx(async (t) => {
    // any(), not none(): a SELECT always returns its (void) row, and none()
    // throws when handed one.
    await t.any(LOCKSQL, [orcidid]);

    const existing = await t.oneOrNone(findactivelogin, {orcidid});

    if (existing && existing.reusable) {
      const retired = await t.result(expireotherlogins,
          {orcidid: orcidid, keep: existing.sessionuuid});
      // Counts only: a sessionuuid is a credential and doesn't belong in logs.
      console.log('session reused; ' + retired.rowCount +
        ' duplicate live session(s) expired');
      return {
        sessionuuid: existing.sessionuuid,
        expiresat: existing.expiresat,
        reused: true,
      };
    }

    const retired = await t.result(expireotherlogins,
        {orcidid: orcidid, keep: null});
    const created = await t.one(insertuserlogin,
        {orcidid: orcidid, ipaddr: ipaddr, orcidname: orcidname});
    console.log('session created; ' + retired.rowCount +
      ' earlier live session(s) expired');
    return {
      sessionuuid: created.sessionuuid,
      expiresat: created.expiresat,
      reused: false,
    };
  });
}

module.exports.getOrCreateSession = getOrCreateSession;
