// pollen query:

//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

function pollen(req, res, next) {

  // Get the query string:
  var query = {};

  res.status(200)
    .json({
		success: 1,
		status: 'success',
		query: query,
		message: 'Retrieved pollen'
      })
}

module.exports = pollen;
