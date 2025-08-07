// depositional environment querry
'use strict';
const {sql, validateOut, ifUndef} = require('../../../src/neotomaapi.js');

// Create a QueryFile globally, once per file:
const depenvquery = sql('../v2.0/helpers/depenvt/depenvt.sql');

/**
 * General call to obtain depositional environemt information from the Neotoma Database.
 * @param {req} req An express.js `requests` object.
 * @param {res} res An express.js `response` object.
 * @param {next} next An express.js `next` object.
 */
function depenvbyid(req, res, next) {
  const db = req.app.locals.db;

  let outobj = {
    'datasetid': ifUndef(req.query.datasetid, 'sep'),
    'limit': req.query.limit || 25,
    'offset': req.query.offset || 0,
  };

  outobj = validateOut(outobj);

  if (Object.keys(outobj).every(function(x) {return typeof outobj[x] === 'undefined';}) === false) {
    db.any(depenvquery, outobj)
        .then(function(data) {
          if (data.length === 0) {
          // We're returning the structure, but nothing inside it:
            var returner = [];
          } else {
            returner = data;
          };

          res.status(200)
              .json({
                status: 'success',
                data: returner,
              });
        })
        .catch(function(err) {
          res.status(500)
              .json({
                status: 'failure',
                data: err.message,
              });
        });
  };
}

module.exports.depenvbyid = depenvbyid;