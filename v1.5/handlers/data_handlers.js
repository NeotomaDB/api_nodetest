const bib   = require('../helpers/bib_format');
//get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

// Defining the query functions:
module.exports = {
  chronology:chronology,
  publicationbydataset:publicationbydataset,
  downloads:downloads,
  geopoliticalunits: function (req, res, next) { 
    console.log("calling geopoliticalunits helper");
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalunits(req, res, next); 
  },
  geopolbysite: function (req, res, next) { 
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopolbysite(req, res, next); 
  },
  geopoliticalbyid: function (req, res, next) { 
    var geopol = require('../helpers/geopoliticalunits/geopoliticalunits.js');
    geopol.geopoliticalbyid(req, res, next); 
  },
  occurrencebyid: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebyid(req, res, next);
  },
  occurrencequery: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencequery(req, res, next);
  },
  occurrencebytaxon: function (req, res, next) {
    var occurrences = require('../helpers/occurrence/occurrence.js')
    occurrences.occurrencebytaxon(req, res, next);
  },
  publicationid:publicationid,
  publicationquery:publicationquery,
  publicationbysite:publicationbysite,
  taxonbyid: function (req, res, next) { 
    var taxon = require('../helpers/taxa/taxa.js');
    taxon.taxonbyid(req, res, next);
  },
  taxonquery: function (req, res, next) { 
    var taxon = require('../helpers/taxa/taxa.js');
    taxon.gettaxonquery(req, res, next);
  },
  pollen: function (req, res, next) { 
    var pollen = require('../helpers/pollen/pollen.js');
    pollen(req, res, next);
  },
// RETURNING SITES:
  sitesbyid: function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbyid(req, res, next);
  },
  sitesquery:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesquery(req, res, next); 
  },
  sitesbygeopol:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbygeopol(req, res, next);
  },
  sitesbydataset:function (req, res, next) { 
    var sites = require('../helpers/sites/sites.js');
    sites.sitesbydataset(req, res, next); 
  },
// RETURNING DATASETS
  datasets: function (req, res, next) { 
    console.log("datasets handler");
    var datasets = require('../helpers/datasets/datasets.js');
    //messy need for which or if conditional to check for which
    //query parameters have been passed

    if(req.query.hasOwnProperty('siteid')){
      console.log("req.query.siteid: "+req.query.siteid);
      datasets.datasetsbysiteid(req,res,next);
    } else if (req.query.hasOwnProperty('datasetids')){
       datasets.datasetbyids(req, res, next); 
    } else {
       datasets.datasetbyid(req, res, next); 
    }
  },

  datasetquery: function (req, res, next) { 
    var dataset = require('../helpers/datasets/datasets.js');
    dataset.datasetquery(req, res, next); 
  },
  contactquery: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactquery(req, res, next); 
  },
  contactsbyid: function (req, res, next) { 
    var contact = require('../helpers/contacts/contacts.js');
    contact.contactsbyid(req, res, next); 
  },


};

function downloads(req,res,next){
  var datasetId = req.params.datasetid;
  
  if(!datasetId){
    res.status(200)
      .type('application/json')
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No datasetid provided.'
    })
  } else {
    db.task(function(t){
        return t.batch([
        //Dataset 0
        t.one('select distinct d.datasetid, ddoi.doi, d.datasetname, d.collunithandle, d.datasettype, d.colltype as "collunittype", d.databasename from da.datasets as d left outer join ndb.datasetdoi as ddoi on ddoi.datasetid = d.datasetid where d.datasetid = $1 limit 1;', datasetId),
        //PI's 1
        t.any('select ndb.datasetpis.contactid, c.contactname from ndb.datasetpis inner join ndb.contacts as c on ndb.datasetpis.contactid = c.contactid where ndb.datasetpis.datasetid = $1 ;', datasetId),
        //Sites 2
        t.any('select s.siteid, s.sitename, s.altitude,s.latitudenorth,s.latitudesouth,s.longitudeeast,s.longitudewest, (s.longitudeeast + s.longitudewest) / 2 as "longitude",(s.latitudenorth + s.latitudesouth) / 2 as "latitude", s.sitedescription,s.notes as "sitenotes" from ndb.datasets inner join ndb.collectionunits on ndb.datasets.collectionunitid = ndb.collectionunits.collectionunitid left outer join ndb.sites as s on ndb.collectionunits.siteid = s.siteid where ndb.datasets.datasetid = $1;', datasetId),
        //Samples 3
        t.any('select s.sampleid, s.samplename, au.analysisunitname, au.depth as "analysisunitdepth", au.thickness as "analysisunitthickness" from ndb.samples as s inner join ndb.analysisunits as au on s.analysisunitid = au.analysisunitid where s.datasetid = $1;', datasetId),
        //SampleAges 4
        t.any('select s.sampleid, c.chronologyid, c.chronologyname, at.agetype, sa.age, sa.ageyounger, sa.ageolder from ndb.samples as s left outer join ndb.sampleages as sa on s.sampleid = sa.sampleid left outer join ndb.chronologies as c on sa.chronologyid = c.chronologyid left outer join ndb.agetypes as at on c.agetypeid = at.agetypeid where s.datasetid = $1;', datasetId),
        //SampleData 5
        t.any('select d.sampleid, tgt.taxagroup, eg.ecolgroupid, d.value, vu.variableunits, t.taxonname, ve.variableelement, vc.variablecontext from ndb.data as d inner join ndb.samples as s on d.sampleid = s.sampleid inner join ndb.variables as v on d.variableid = v.variableid inner join ndb.taxa as t on v.taxonid = t.taxonid left outer join ndb.variableunits as vu on v.variableunitsid = vu.variableunitsid left join ndb.variableelements as ve on v.variableelementid = ve.variableelementid left join ndb.variablecontexts as vc on v.variablecontextid = vc.variablecontextid left outer join ndb.taxagrouptypes as tgt on t.taxagroupid = tgt.taxagroupid inner join ndb.ecolgroups as eg on t.taxonid = eg.taxonid where s.datasetid = $1;', datasetId),
        //Last submission date 6
        t.one('select ndb.datasetsubmissions.submissiondate from ndb.datasetsubmissions where ndb.datasetsubmissions.datasetid = $1 order by ndb.datasetsubmissions.submissiondate desc limit 1', datasetId),
        //Default chronology 7
        t.any('select c.chronologyid from ndb.datasets as d inner join ndb.chronologies as c on d.collectionunitid = c.collectionunitid where d.datasetid = $1 and c.isdefault = true Limit 1;', datasetId)
        ])
      })
      .then(function (data) {
          console.log("data/downloads iterate over results");
          var dataset = data[0];
          dataset["datasetpis"] = data[1];
          if (data[2]){
            console.log("should only be 1 site: num sites "+data[2].length);
            //return an object, not an array
            dataset["site"] = data[2][0];

          } else {
            dataset["site"] = null
          }
          dataset["defchronologyid"] = data[7];
          dataset["neotomalastsub"] = data[6];
          //iterate through Samples; add SampleAges and SampleData
          data[3].forEach(function(s,i){
            var arrSampleAges = data[4].filter(function(sa){
              return sa.sampleid == s.sampleid;
            }).map(function(d){
              var saObj = {};
              saObj.chronologyid = d.chronologyid;
              saObj.chronologyname = d.chronologyname;
              saObj.agetype = d.agetype;
              saObj.age = d.age;
              saObj.ageyounger = d.ageyounger;
              saObj.ageolder = d.ageolder;
              return saObj
            })
            var arrSampleData = data[5].filter(function(sd){
              return sd.sampleid == s.sampleid;
            }).map(function(e){
              var sdObj = {};
              sdObj.taxagroup = e.taxagroup;
              sdObj.ecolgroupid = e.ecolgroupid;
              sdObj.value = e.value;
              sdObj.variableunits = e.variableunits;
              sdObj.taxonname = e.taxonname;
              sdObj.variableelement = e.variableelement;
              sdObj.variablecontext = e.variablecontext;
              return sdObj
            })
            //console.log("arrSampleData length"+arrSampleData.length);
            s["sampleages"] = arrSampleAges;
            s["sampledata"] = arrSampleData;
          });
          dataset["samples"] = data[3];
          res.status(200)
            .jsonp({
              success: 1,
              status: 'success',
              data: [dataset],
              message: 'Retrieved dataset download'
            });
      })
      .catch(function (err) {
          console.log("ERROR:", err.message || err);
          next(err);
      });
  }
}

//one route defined chronologies/:id
//TODO write function
function chronology(req, res, next) {
  var chronId = +req.params.id;

/*
  function ChronologyByIdv2(id){
    this.id = +id;
    this._rawDBType = true;
    this.formatDBType = function(){
      return 'select * from da.chronologybyidv2('+id+')';
    };
  }
  */
  var c = "select * from da.chronologybyid($1)";
  //console.log("sql: "+c);

  if(chronId){
    db.any(c, [chronId])
    .then(function(data){
      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: data,
          message: 'Retrieved chronology'
          })
      }).catch(function (err) {
        return next(err);
    });    
  } else {
     res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No chronologyid provided.'
    })
  }

}


function publicationid(req, res, next) {
  
  if (!!req.params.pubid) {
    var pubid = parseInt(req.params.pubid);
  } else {
    var pubid = null;
  }
  
  var query = 'select * from ndb.publications AS pubs where pubs.publicationid = $1';
  


  output = db.any(query, [pubid])
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });    })
    .catch(function (err) {
      return next(err);
    });
};

function publicationquery(req, res, next) {
  //return publications for datasetid
  //v1 query
    /*
     "SELECT DISTINCT PubType, Citation, Year, PublicationID" +
     " FROM DA.Publications" +
     " where 1 = 1" +
     " AND PublicationId = @pubId";
     */
  var datasetId =  req.query.datasetid;
  var query =  "select distinct pubtype, citation, year, publicationid" +
     " from da.publications" +
     " where 1 = 1" +
     " and datasetid = $1";
  
  if(!datasetId){
    res.status(200)
      .jsonp({
        success: 0,
        status: 'failure',
        data: null,
        message: 'No datasetid provided.'
    })
  } else {
    db.any(query, [datasetId])
      .then(function(data){
         res.status(200)
            .jsonp({
              success: 1,
              status: 'success',
              data: data,
              message: 'Retrieved publications for datasetid'
            });
      })
     .catch(function (err) {
          console.log("ERROR:", err.message || err);
          next(err);
      });
  }   
  
};

function publicationbysite(req, res, next) {

};

function publicationbydataset(req, res, next) {

  /*
  Get publications by associated dataset IDs:
  */

  if (!!req.params.datasetid) {
  
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
      return parseInt(item, 10);
    });

    
    query = 'WITH dpub AS '+
            '(SELECT * FROM ndb.datasetpublications as dp ' +
            'WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv))) ' +
            'SELECT * FROM ndb.publications AS pub INNER JOIN ' +
            'ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid INNER JOIN ' +
            'ndb.contacts as ca ON ca.contactid = pa.contactid ' +
            'WHERE pub.publicationid IN (SELECT publicationid FROM dpub)'

  }
  
  output = db.any(query, [datasetid])
    .then(function (data) {
      bib_output = bib.formatpublbib(data);

      res.status(200)
        .jsonp({
          success: 1,
          status: 'success',
          data: bib_output,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      next(err);
    });
}