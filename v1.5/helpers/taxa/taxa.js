// Taxa query:

/* query inputs:
taxonid, taxonname, status, taxagroup, ecolgroup, format

    taxaids []integer optional,
    taxagroup: varchar,
    status: varchar //extinct, extant, or all  optional

1. check if any parameters are invalid

case: 
  no taxaids, have ecolGroupid
  have array taxaids, no ecolGroupid
  have both
2. search for taxa ids[] by taxonName, status, taxaGroup
3. if ecolGroup pass, clear taxaids, and populate taxaids[] by ecolGroup
4. 


*/
var empty = {
  "query":{   'taxonid':null,
                   'name':null,
              'ecolgroup':null,
                  'lower':null
            },
  "response":{
              "taxonid": null,
            "taxoncode": null,
            "taxonname": null,
               "author": null,
        "highertaxonid": null,
              "extinct": null,
          "taxagroupid": null,
        "publicationid": null,
                "notes": null,
           "ecolgroups": []
    }};
/*example
Author: "Cuvier, 1829"
EcolGroups: ["SCOR"]
Extinct: false
HigherTaxonID: 8851
Notes: null
PublicationID: 3662
TaxaGroupID: "FSH"
TaxonCode: "Hmi"
TaxonID: 8858
TaxonName: "Hemitripterus"

*/

// Sites query:

const path = require('path');
const bib   = require('./../bib_format');

//get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {minify: true});
}

// Create a QueryFile globally, once per file:
const taxonquerylower  = sql('./taxonquerylower.sql');
const taxonquerystatic = sql('./taxonquerystatic.sql');

// Actual functions:
// 
function taxonbyid(req, res, next) {
  
  var taxonid = String(req.params.taxonid).split(',').map(function(item) {
    return parseInt(item, 10);
  });

  if (!!taxonid) {
    query = 'SELECT * FROM ndb.taxa WHERE taxa.taxonid IN ($1:csv)';
  } else {

      res.status(500)
        .json({
          status: 'failure',
          data: empty,
          message: 'Must pass either queries or an integer sequence.'
        });
  }

  db.any(query, [taxonid])
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
    });
}

function gettaxonquery(req, res, next) {

  if (!!req.query.taxonid) {
    var taxonid = String(req.query.taxonid).split(',').map(function(item) {
      return parseInt(item, 10);
    });
  } else {
    var taxonid = null;
  }

  var paramobj = {'taxonid':taxonid,
                'taxonname':req.query.taxonname,
                   'status':req.query.status,
                'taxagroup':req.query.taxagroup,   
                'ecolgroup':req.query.ecolgroup
               };

  if (typeof paramobj.taxonid === 'undefined') {
    paramobj.taxonid = null;
  };

  if(!(typeof paramobj.taxonname === 'undefined')) {
    paramobj.taxonname = paramobj.taxonname.replace(/\*/g, "\%");
  }

  var novalues = Object.keys(paramobj).every(function(x) { 
    return typeof paramobj[x]==='undefined' || !paramobj[x];
  });


  console.log("taxaquery params: "+ JSON.stringify(paramobj));

  if(novalues == true) {
    if(!!req.accepts('json') & !req.accepts('html')) {
      res.redirect('/swagger.json');
    } else {
      res.redirect('/api-docs');
    };
  } else {   
      db.any(taxonquerystatic, paramobj)      
        .then(function (data) {
             res.status(200)
              .jsonp({
                success: 1,
                status: 'success',
                data: data,
                message: 'Retrieved all tables'
              });
          })
          .catch(function (err) {
              return next(err);
          });
    };
}

module.exports.taxonbyid = taxonbyid;
module.exports.gettaxonquery = gettaxonquery;