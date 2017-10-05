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

// Create a QueryFile globally, once per file:
const contactbyid = sql('./contactbyid.sql');
 
function contactsbyid(req, res, next) {

  if (!!req.params.contactid) {
    var contactid = String(req.params.contactid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

  } else {
    res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(contactbyid, [contactid])
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
