// Sites query:

const path = require('path');

//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

const chronologybyidsql = sql('./chronologybyid.sql');


function chronologybyid(req, res, next) {

  if (!!req.params.chronologyid) {
    var chronologyid = String(req.params.chronologyid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.'
        });
  };

  db.any(chronologybyidsql, [chronologyid])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
        return next(err);
    }) 
}

module.exports.chronologybyid = chronologybyid;