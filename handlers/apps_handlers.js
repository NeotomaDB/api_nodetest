const bib   = require('../helpers/bib_format');

//get global database object
var db = require('../database/pgp_db');
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
      //process text records
      //var jsonData = JSON.parse(data[0]);
      console.log(JSON.stringify(data[0]));
      console.log(data[0].gettaxaindatasets);
      test = [data[0]];

      var arrMs = test.map(function(elem){
        var strLen = elem.gettaxaindatasets.length;
        //console.log("string length: "+strLen);
        var d = elem;
        //console.log(d);
        var str = d.gettaxaindatasets.slice(1,strLen-1); 
        var a = str.split(","); 
        var obj = {}; 
        obj.TaxonName = a[1];
        obj.TaxonID = +a[0];
        obj.TaxaGroupID = a[2];
        //obj.DatasetTypeID = +a[3];
        obj.DatasetTypesIDs = [+a[3]]; 
        console.log(typeof obj.DatasetTypesIDs);
        console.log("length of obj.DatasetTypesIDs "+obj.DatasetTypesIDs);
        console.log(obj.TaxonName +":"+obj.TaxonID +":"+obj.TaxaGroupID +":"+obj.DatasetTypesIDs[0])
        return obj; 
      });
      
      console.log("result array length: " + arrMs.length);

      //var arrMs = arrM.slice(0,4);

      var aggF = arrMs.map(function(d,i){

        var tmpIDset = arrMs.filter(function(e){
            return e.TaxonID == 28461//d.TaxonID;
        });

        var tmpArr = [];

        console.log("filtered entry: "+tmpIDset.length);

        var tmpAgg = tmpIDset.reduce(function(j,k, l, tmpArr){
            //console.log(j);
            console.log("j arr len"+j.DatasetTypeIDs.length + "k arr len"+k.DatasetTypesIDs.length);
            return j.DatasetTypesIDs.concat(k.DatasetTypesIDs);
        });

        var aggObj = d;//d.DatasetTypesIDs;
        aggObj.DatasetTypesIDs = tmpAgg;//tmpAgg.DatasetTypesIDs;
        
          return aggObj;
      });

      console.log("affF.length is "+aggF.length);


       res.status(200)
        .type('application/json')
        .jsonp({
          status: 'success',
          data: JSON.stringify(aggF),
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