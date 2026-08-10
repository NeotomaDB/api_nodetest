'use strict';
// This is the module that turns an ORCID token into a Neotoma session:
// The user sends the access token they received from the ORCID OAuth flow.
// We validate it by asking orcid.org/oauth/userinfo who it belongs to.
// If ORCID recognises it, we check that the person is a Neotoma steward, and
// only then record a login in ap.orcidlogins, which mints an opaque session
// UUID (see newlogin.sql), and send that UUID back to the caller.
// The session UUID is the credential for every authenticated request afterwards,
// passed as `Authorization: Bearer <sessionuuid>` and checked by sessionauth.js.
// Session lifetime is set in newlogin.sql — currently 1 week — and its expiry is
// returned alongside the UUID so clients don't have to guess.

const {sql} = require('../../../src/neotomaapi.js');

const insertuserlogin = sql('../v2.0/helpers/validation/newlogin.sql');
const stewardbyorcid = sql('../v2.0/helpers/validation/stewardbyorcid.sql');

// How long we're willing to wait on orcid.org. fetch() has no overall timeout of
// its own, so without this an unresponsive ORCID hangs the request indefinitely.
const ORCIDTIMEOUTMS = 10000;

const INVALIDTOKENMSG = 'The ORCID token is not valid or has expired. ' +
  'Please log in again.';

const NOTSTEWARDMSG = 'Only Neotoma database stewards may log in. ' +
  'If you believe you should have access, contact the Neotoma team.';

/**
 * Check an ORCID token passed to the Neotoma API:
 * @param {object} req An object passed through Express
 * @param {object} res A resolve object passed through Express
 * @param {object} next A next object passed through Express *
 * **/
const checktoken = async function(req, res, next) {
  const db = req.app.locals.db;
  const token = req.body.token;
  const agent = 'Neotoma Paleoecology Database Authentication goring@wisc.edu';
  const ipaddr = req.socket.remoteAddress;

  // We want to take in a token and check that we get something reasonable back.
  try {
    const postresponse = await fetch('https://orcid.org/oauth/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'User-Agent': agent,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(ORCIDTIMEOUTMS),
    });

    // ORCID answers 403 for a token it doesn't recognise. Every branch from here
    // on has to call res: this used to fall through without responding, which
    // left the client hanging until it gave up rather than reporting a bad token.
    if (postresponse.status !== 200) {
      return res.status(401)
          .json({
            status: 'unauthorized',
            message: INVALIDTOKENMSG,
          });
    }

    const responsetext = await postresponse.text();
    const result = JSON.parse(responsetext);

    if (Object.keys(result).includes('error')) {
      // ORCID said 200 but handed back an error body. Note we don't echo the
      // token: it's a credential, and it would end up in logs and the browser.
      return res.status(401)
          .json({
            status: 'unauthorized',
            data: result,
            message: INVALIDTOKENMSG,
          });
    }

    // The identifier everything keys off. It goes into ap.orcidlogins.orcidid,
    // and /orcids/steward joins ndb.externalcontacts against that column, so the
    // steward check below deliberately uses this same value — if it were derived
    // separately the two could disagree about who is a steward.
    const orcidid = result['id'];

    // Only stewards get a session. Checked before the insert, so a rejected
    // login leaves no row behind in ap.orcidlogins.
    const steward = await db.oneOrNone(stewardbyorcid, {'orcidid': orcidid});

    if (!steward) {
      return res.status(403)
          .json({
            status: 'forbidden',
            message: NOTSTEWARDMSG,
          });
    }

    const uuidres = await db.one(insertuserlogin,
        {'orcidid': orcidid, 'ipaddr': ipaddr,
          'orcidname': result['name'] ||
            [result['given_name'], result['family_name']].filter(Boolean).join(' ') ||
            null});

    return res.status(200)
        .json({
          status: 'success',
          data: {
            user: result,
            neotoken: uuidres,
          },
          message: 'Neotoma token expires in 1wk',
        });
  } catch (err) {
    // An aborted fetch lands here rather than returning a response, so it needs
    // separating from our own failures — 504 says "ORCID is unreachable", not
    // "Neotoma is broken".
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      console.error('ORCID userinfo did not respond within ' +
        ORCIDTIMEOUTMS + 'ms');
      return res.status(504)
          .json({
            status: 'error',
            message: 'ORCID did not respond in time. Please try again.',
          });
    }
    console.error(err);
    return res.status(500)
        .json({
          status: 'error',
          data: err,
          message: 'Failed to generate token.',
        });
  }
};

module.exports.checktoken = checktoken;
