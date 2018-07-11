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
  db.query('select * from ap.getcollectiontypes()')
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

   db.query('select * from ap.getdatasettypes();')
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
  
  db.query('select * from ap.gettaxaindatasets()')
    .then(function(data){
      //data are records of (taxonid, taxonname, taxagroupid, datasettypeid)
      //example record: {"gettaxaindatasets":"(27739,albite,CHM,28)"}
      //desired output:  [...,{"TaxonName":"Acalypha-type","TaxonID":27017,"TaxaGroupID":"VPL","DatasetTypeIDs":[3,4,7,23]},...]
    
      var rawTaxa = data;
      var datasettypesByTaxon = [];
      var currentTaxonID = -1;
      var dtbytxnObj = {};

      rawTaxa.forEach(function(d,i){
        if ( currentTaxonID == d.taxonid ){
          //found additional records for taxonid, add datasettype to array
          dtbytxnObj.DatasetTypesIDs.push(+d.datasettypeid);
        } else {
          //if dtbytxnObj not empty object, add to results before creating new instance for next taxon
          if ( dtbytxnObj.hasOwnProperty("TaxonID") ){
            datasettypesByTaxon.push(dtbytxnObj);
          }
          currentTaxonID = d.taxonid;
          dtbytxnObj = {};
          dtbytxnObj.TaxonID = +d.taxonid;
          dtbytxnObj.TaxonName = d.taxonname;
          dtbytxnObj.TaxaGroupID = +d.taxagroupid;
          dtbytxnObj.DatasetTypesIDs = [];
          dtbytxnObj.DatasetTypesIDs.push(+d.datasettypeid)
        }
      })      

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

   db.query('select * from ap.gettaxagrouptypes();')
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

   db.query('select * from ap.getkeywords();')
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

   db.query('select * from ap.getpeople();')
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
    db.query('select * from ap.gettaphonomicsystems('+datasetTypeId+');')
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

   db.query('select * from ap.getdeptenvtypesroot();')
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