'use strict';
// This is the module that turns an ORCID token into a Neotoma session:
// The user sends the access token they received from the ORCID OAuth flow.
// We validate it by asking orcid.org/oauth/userinfo who it belongs to.
// If ORCID recognises it, we record a login in ap.orcidlogins, which mints an
// opaque session UUID (see newlogin.sql), and send that UUID back to the caller.
// The session UUID is the credential for every authenticated request afterwards,
// passed as `Authorization: Bearer <sessionuuid>` and checked by sessionauth.js.
// Session lifetime is set in newlogin.sql — currently 1 week — and its expiry is
// returned alongside the UUID so clients don't have to guess.

const {sql} = require('../../../src/neotomaapi.js');

const insertuserlogin = sql('../v2.0/helpers/validation/newlogin.sql');

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
    });
    if (postresponse.status === 200) {
      const responsetext = await postresponse.text();
      const result = await JSON.parse(responsetext);
      if (Object.keys(result).includes('error')) {
        const msg = 'The ORCID token passed to Neotoma is not valid:' +
          token;
        res.status(407)
            .json({
              status: 'Proxy Authentication Required',
              data: result,
              message: msg,
            });
      } else {
        const dbpush = await db.one(insertuserlogin,
            {'orcidid': result['id'], 'ipaddr': ipaddr,
              'orcidname': result['name'] ||
                [result['given_name'], result['family_name']].filter(Boolean).join(' ') ||
                null});
        const uuidres = await dbpush;
        res.status(200)
            .json({
              status: 'success',
              data: {
                user: result,
                neotoken: uuidres,
              },
              message: 'Neotoma token expires in 1wk',
            });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500)
        .json({
          status: 'error',
          data: err,
          message: 'Failed to generate token.',
        });
  }
};

module.exports.checktoken = checktoken;
