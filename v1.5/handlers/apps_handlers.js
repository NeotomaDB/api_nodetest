const bib = require('../helpers/bib_format');

// get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

module.exports = {
  datasettypes: datasettypes,
  collectiontypes: collectiontypes,
  elementtypes: elementtypes,
  geochronologies: function (req, res, next) {
    var geochronologies = require('../helpers/geochronologies/geochronologies.js');
    geochronologies.geochronologies(req, res, next);
  },
  taxaindatasets: taxaindatasets,
  taxagrouptypes: taxagrouptypes,
  keywords: keywords,
  authorpis: authorpis,
  authors: authors,
  taphonomysystems: taphonomysystems,
  depositionalenvironments: depositionalenvironments,
  depositionalenvironmentsbyid: depositionalenvironmentsbyid,
  relativeages: relativeages,
  search: function (req, res, next) {
    console.log('calling search helper');
    var exsearch = require('../helpers/search/search.js');
    exsearch.explorersearch(req, res, next);
  }
};

// Defining the query functions:

/* All the Endpoint functions */
function collectiontypes (req, res, next) {
  db.query('select * from ap.getcollectiontypes()')
    .then(function (data) {
      res.status(200)
        .type('application/json')
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all collectiontypes'
        })
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Ran into an error.'
        });
    })
}

function datasettypes (req, res, next) {
  // Get the query string:

  db.query('select * from ap.getdatasettypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all datasettypes'
        })
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'failure',
          data: err.message,
          message: 'Ran into an error.'
        });
    });
}

/** ** deprecated seach handler ****

function exsearch(req, res, next) {
  console.log("hitting app/search handler");
  var data = [];
  // Get the query string:

  //search input param is stringified JSON object, thus parse first
  var inputParamObj = JSON.parse(req.query.search);
  console.log("req.query.search object using JSON.stringify: "+ JSON.stringify(inputParamObj));

  console.log("Object.entries: "+Object.entries(inputParamObj));

    var qryParams = {
    _taxonids: [],
    _elemtypeids: [],
    _taphtypeids: [],
    _depenvids: [],
    _abundpct: null,
    _datasettypeid: null,
    _keywordid: null,
    _coords: null,
    _gpid: null,
    _altmin: null,
    _altmax: null,
    _coltypeid: null,
    _dbid: null,
    _sitename: null,
    _contactid: null,
    _ageold: null,
    _ageyoung: null,
    _agedocontain: null, //default true
    _agedirectdate: null, //default false
    _subdate: null
  }

if (inputParamObj.taxa){
    qryParams._taxonids = inputParamObj.taxa.taxonIds;
}

if (inputParamObj.time){

}

if (inputParamObj.metadata){

}

if (inputParamObj.abundance){

}

if (inputParamObj.space){

}

//parse search parameters
  Object.keys(inputParamObj).every(function(x) {
    var modProp = "_"+x;
    console.log("x: "+x);
    console.log("modProp: "+ modProp);
    if(qryParams.hasOwnProperty(modProp)){
      qryParams[modProp] = inputParamObj[x];
    }
  });

   Object.getOwnPropertyNames(inputParamObj).every(function(x) {
    var modProp = "_"+x;
    console.log("x: "+x);
    console.log("modProp: "+ modProp);
    //if(qryParams.hasOwnProperty(modProp)){
    //  qryParams[modProp] = inputParamObj[x];
    //}
  });

   console.log("inputParamObj is: "+JSON.stringify(qryParams, null, 2));

   -//-db.query('select * from ap.explorersearch($1,  $2,  $3,  $4,  $5,  $6,  $7,  $8,  $9,  $10,  $11,  $12,  $13,  $14,  $15,  $16,  $17,  $18,  $19,  $20);', qryParams)
    db.query('select * from ap.explorersearch('+
      '_taxonids,'+
      '_elemtypeids,'+
      '_taphtypeids,'+
      '_depenvids,'+
      '_abundpct,'+
      '_datasettypeid,'+
      '_keywordid,'+
      '_coords,'+
      '_gpid,'+
      '_altmin,'+
      '_altmax,'+
      '_coltypeid,'+
      '_dbid,'+
      '_sitename,'+
      '_contactid,'+
      '_ageold,'+
      '_ageyoung,'+
      '_agedocontain,'+ //default true
      '_agedirectdate,'+ //default false
      '_subdate)',
      qryParams)
        .then(function (data) {
          res.status(200)
            .type('application/json')
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved Explorer search results'
            })
        })
        .catch(function (err) {
          return next(err);
        });
}

*** end deprecated search handler */

function elementtypes (req, res, next) {
  var taxonid, taxagroupid;
  taxonid = req.query.taxonid;
  taxagroupid = req.query.taxagroupid;

  if (!parseInt(taxonid) && !taxagroupid) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No taxagroupid or taxonid provided. Query requires one.'
      })
  } else {
    if (!taxagroupid) {
      console.log('calling ap.getelementtypesbytaxonid($1)');
      db.query('select * from ap.getelementtypesbytaxonid($1)', [taxonid])
        .then(function (data) {
          res.status(200)
            .type('application/json')
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved all elementtypes for taxonid'
            })
        })
        .catch(function (err) {
          return next(err);
        })
    } else {
      console.log('calling ap.getelementtypes($1)')
      db.query('select * from ap.getelementtypes($1)', [taxagroupid])
        .then(function (data) {
          res.status(200)
            .type('application/json')
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved all elementtypes for taxagroupid'
            })
        })
        .catch(function (err) {
          return next(err);
        })
    }
  }
}

function taxaindatasets (req, res, next) {
  db.query('select * from ap.gettaxaindatasets()')
    .then(function (data) {
      // data are records of (taxonid, taxonname, taxagroupid, datasettypeid)
      // example record: {"gettaxaindatasets":"(27739,albite,CHM,28)"}
      // desired output:  [...,{"TaxonName":"Acalypha-type","TaxonID":27017,"TaxaGroupID":"VPL","DatasetTypeIDs":[3,4,7,23]},...]

      var rawTaxa = data;
      var datasettypesByTaxon = [];
      var currentTaxonID = -1;
      var dtbytxnObj = {};

      rawTaxa.forEach(function (d, i) {
        if (currentTaxonID == d.taxonid) {
          // found additional records for taxonid, add datasettype to array
          dtbytxnObj.datasettypeids.push(+d.datasettypeid);
        } else {
          // if dtbytxnObj not empty object, add to results before creating new instance for next taxon
          if (dtbytxnObj.hasOwnProperty('taxonid')) {
            datasettypesByTaxon.push(dtbytxnObj);
          }
          currentTaxonID = d.taxonid;
          dtbytxnObj = {};
          dtbytxnObj.taxonid = +d.taxonid;
          dtbytxnObj.taxonname = d.taxonname;
          dtbytxnObj.taxagroupid = d.taxagroupid;
          dtbytxnObj.datasettypeids = [];
          dtbytxnObj.datasettypeids.push(+d.datasettypeid)
        }
      })

      // add last taxon object to results
      if (dtbytxnObj.hasOwnProperty('taxonid')) {
        datasettypesByTaxon.push(dtbytxnObj);
      }

      res.status(200)
        .type('application/json')
        .jsonp({
          success: 1,
          status: 'success',
          data: datasettypesByTaxon,
          message: 'Retrieved all taxa in datasets'
        })
    }).catch(function (err) {
      return next(err);
    })
}

function taxagrouptypes (req, res, next) {
  // Get the query string:
  var query = {};

  db.query('select * from ap.gettaxagrouptypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all taxagrouptypes'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function keywords (req, res, next) {
  // Get the query string:
  var query = {};

  db.query('select * from ap.getkeywords();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all keywords'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function authorpis (req, res, next) {
  // Get the query string:
  var query = {};

  db.query('select * from ap.getpeople();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all authors PIs'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function authors (req, res, next) {
  // Get the query string:
  var query = {};

  db.query('select * from ap.getauthors();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved all authors'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function taphonomysystems (req, res, next) {
  // Get the query string:
  var datasetTypeId = req.query.datasetTypeId;

  if (!datasetTypeId) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No datasetTypeId provided.'
      })
  } else {
    db.query('select * from ap.gettaphonomicsystems(' + datasetTypeId + ');')
      .then(function (data) {
        res.status(200)
          .jsonp({
            success: 1,
            status: 'success',
            data: data,
            message: 'Retrieved taphonomic system for dataset type id'
          })
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

function depositionalenvironments (req, res, next) {
  // Get the query string:
  var query = {};

  db.query('select * from ap.getdeptenvtypesroot();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved root depositional environment types'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function depositionalenvironmentsbyid (req, res, next) {
  // Get the query string:
  var depenvtid = req.params.id;
  console.log('depenvtid is: ' + depenvtid);

  if (isNaN(depenvtid)) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No depenvtid provided.'
      })
  } else {
    db.query('select * from ap.getdeptenvtypes($1);', [depenvtid])
      .then(function (data) {
        res.status(200)
          .jsonp({
            success: 1,
            status: 'success',
            data: data,
            message: 'Retrieved depositional environment types'
          })
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

function relativeages (req, res, next) {
  // Get the query string:
  var ageScaleID = req.query.agescaleid;
  if (!req.query.agescaleid || !parseInt(req.query.agescaleid)) {
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No agescaleid provided.'
      })
  }

  db.query('SELECT * FROM ndb.relativeages where relativeagescaleid = $1;', [ageScaleID])
    .then(function (data) {
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved relativeages'
        })
    })
    .catch(function (err) {
      return next(err);
    });
}
