const bib   = require('../helpers/bib_format');

//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;



  module.exports = {
  datasettypes: datasettypes,
  collectiontypes: collectiontypes,
  taxaindatasets: taxaindatasets,
  taxagrouptypes: taxagrouptypes,
  keywords: keywords,
  authorpis: authorpis,
  taphonomysystems: taphonomysystems,
  depositionalenvironments: depositionalenvironments
};



// Defining the query functions:

/* All the Endpoint functions */
function collectiontypes(req, res, next){
  db.query('select ap.getcollectiontypes()')
    .then(function(data){
      res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all collectiontypes'
        })
    })
    .catch(function(err){
      return next(err);
    })
}


function datasettypes(req, res, next) {
  // Get the query string:
  var query = {};

   db.query('select ap.getdatasettypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all datasettypes'
        })
    })
    .catch(function (err) {
      return next(err);
    });


}

function taxaindatasets(req, res, next){
  
  db.query('select ap.gettaxaindatasets()')
    .then(function(data){
      //data are records of (taxonid, taxonname, taxagroupid, datasettypeid)
      //example record: {"gettaxaindatasets":"(27739,albite,CHM,28)"}
      //desired output:  [...,{"TaxonName":"Acalypha-type","TaxonID":27017,"TaxaGroupID":"VPL","DatasetTypeIDs":[3,4,7,23]},...]
    
      var rawTaxa = data;
      var datasettypesByTaxon = [];
      var currentTaxonID = -1;
      var dtbytxnObj = {};

      rawTaxa.forEach(function(d,i){
        var itemContent = d.gettaxaindatasets.slice(1, d.gettaxaindatasets.length - 1);
        var arrContent = itemContent.split(",");
        
        if (currentTaxonID == arrContent[0] ){
          //found additional records for taxonid, add datasettype to array
          dtbytxnObj.DatasetTypesIDs.push(+arrContent[3]);
        } else {
          //if dtbytxnObj not empty object, add to results before creating new instance for next taxon
          if (dtbytxnObj.hasOwnProperty("TaxonID")){
            datasettypesByTaxon.push(dtbytxnObj);
          }
          currentTaxonID = arrContent[0];
          //new taxonid, create new return object and add datasettype to array
          dtbytxnObj = {};
          dtbytxnObj.TaxonID = +arrContent[0];
          dtbytxnObj.TaxonName = arrContent[1];
          dtbytxnObj.TaxaGroupID = arrContent[2];
          dtbytxnObj.DatasetTypesIDs = [];
          dtbytxnObj.DatasetTypesIDs.push(+arrContent[3])
        }

      });

      //add last taxon object to results
      if (dtbytxnObj.hasOwnProperty("TaxonID")){
        datasettypesByTaxon.push(dtbytxnObj);
      }

     
       res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: datasettypesByTaxon,
          message: 'Retrieved all taxa in datasets'
        })


    }).catch(function(err){
      return next(err);
    })
}

function taxagrouptypes(req, res, next) {
  // Get the query string:
  var query = {};

   db.query('select ap.gettaxagrouptypes();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all taxagrouptypes'
        })
    })
    .catch(function (err) {
      return next(err);
    });


}

function keywords(req, res, next) {
  // Get the query string:
  var query = {};

   db.query('select ap.getkeywords();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all keywords'
        })
    })
    .catch(function (err) {
      return next(err);
    });


}

function authorpis(req, res, next) {
  // Get the query string:
  var query = {};

   db.query('select ap.getpeople();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved all authors PIs'
        })
    })
    .catch(function (err) {
      return next(err);
    });
  }

function taphonomysystems(req, res, next) {
  // Get the query string:
  var datasetTypeId = req.query.datasetTypeId;

  if(!datasetTypeId){
    res.status(200)
      .jsonp({
        status: 'failure',
        data: null,
        message: 'No datasetTypeId provided.'
      })
  } else {
    db.query('select ap.gettaphonomicsystems('+datasetTypeId+');')
      .then(function (data) {
        res.status(200)
          .jsonp({
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

function depositionalenvironments(req, res, next) {
  // Get the query string:
  var query = {};

   db.query('select ap.getdeptenvtypesroot();')
    .then(function (data) {
      res.status(200)
        .jsonp({
          status: 'success',
          data: data,
          message: 'Retrieved root depositional environment types'
        })
    })
    .catch(function (err) {
      return next(err);
    });
  }