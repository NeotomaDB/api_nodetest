// xml parser
const js2xmlparser = require('js2xmlparser');
// Sites query:
const path = require('path');
//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;
const bib   = require('./../bib_format');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// get recent uploads sql query
const recentuploadssql = sql('./recentuploadsquery.sql');

console.log('recent uploads query object', recentuploadssql);

function recentuploadsquery(req, res, next) {
    db.any(recentuploadssql)
    .then(function (data) {
        // xml parsing options
        var options = {
            declaration: {
                include: false
            },
            attributeString: "data",
            useCDATA: true
        };

        console.log(js2xmlparser.parse('results',data, options));

        data = js2xmlparser.parse('results', data, options);
        res.status(200).set('Content-Type', 'text/plain').send(data);
    })
    .catch(function (err) {
      next(err);
    });
}

module.exports.recentuploadsquery = recentuploadsquery;
