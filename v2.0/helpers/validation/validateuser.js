'use strict';
// This is the module to manage the cookie:
// The user will send a valid ORCID cookie
// We will validate the cookie
// We will send back a jwt token using our environment variable
// TOKEN_SECRET.
// The user token will expire in 1 week.

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
      console.log(postresponse.text());
      const result = JSON.parse(postresponse.text());
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
            {'orcidid': result['user']['id'], 'ipaddr': ipaddr});
        const uuidres = await dbpush;
        res.status(200)
            .json({
              status: 'success',
              data: {
                user: result['user'],
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
