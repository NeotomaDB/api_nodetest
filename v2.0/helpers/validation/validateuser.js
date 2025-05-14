'use strict';
// This is the module to manage the cookie:
// The user will send a valid ORCID cookie
// We will validate the cookie
// We will send back a jwt token using our environment variable
// TOKEN_SECRET.
// The user token will expire in 1 week.

/**
 * Check an ORCID token passed to the Neotoma API:
 * @param {object} req An object passed through Express
 * @param {object} res A resolve object passed through Express
 * @param {object} next A next object passed through Express *
 * **/
function checktoken(req, res, next) {
  const token = req.body.token;
  const agent = 'Neotoma Paleoecology Database Authentication goring@wisc.edu';
  // We want to take in a token and check that we get something reasonable back.
  fetch('https://orcid.org/oauth/userinfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'User-Agent': agent,
      'Accept': 'application/json',
    },
  })
      .then((res) => {
        console.log(JSON.stringify(res));
        return (res.text());
      })
      .then((out) => {
        return (JSON.parse(out));
      })
      .then((data) => {
        if (Object.keys(data).includes('error')) {
          const msg = 'The ORCID token passed to Neotoma is not valid:' +
            token;
          res.status(407)
              .json({
                status: 'Proxy Authentication Required',
                data: data,
                message: msg,
              });
        } else {
          res.status(200)
              .json({
                status: 'success',
                data: {
                  user: data,
                },
                message: 'Neotoma token expires in 1wk',
              });
        }
      })
      .catch(function(err) {
        console.error(err);
        res.status(500)
            .json({
              status: 'error',
              data: err,
              message: 'Failed to generate token.',
            });
      });
}

module.exports.checktoken = checktoken;
