// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
var validate = require('../validateOut').validateOut

function shortCall (req, res, next) {

  var params = {status: '',
                dsid: ''}

  if (req.params.status === "1") {
    res.status(200)
      .json({
        status: 'success',
        message: 'API is running'
      });
  } else {
    res.status(200)
      .json({
        status: 'success',
        message: 'API is running'
      });
  }
}

module.exports.shortCall = shortCall;
