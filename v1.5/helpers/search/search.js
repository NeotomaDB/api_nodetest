// Sites query:
const path = require('path');
// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {
    minify: true
  });
}

const explorersearchQry = sql('./explorersearchQuery.sql');

module.exports = {
  explorersearch: explorersearch
};

// see link for need of custom function
// https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places#15762794
const roundTo = function (n, digits) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }

  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(digits);
  if (negative) {
    n = (n * -1).toFixed(digits);
  }
  return n;
};

const rollupSites = function (data) {
  var sortSiteID = function (a, b) {
    return a.siteid - b.siteid;
  }
  data.sort(sortSiteID);

  var siteObject = {
    ageoldest: null,
    ageyoungest: null,
    latitude: null,
    longitude: null,
    latitudenorth: null,
    latitudesouth: null,
    longitudeeast: null,
    longitudewest: null,
    minage: null,
    maxage: null,
    sitedescription: null,
    siteid: null,
    sitename: null,
    notes: null
  };

  var siteData = [];
  var currentID = null;
  var currentSite;

  data.forEach(function (d) {
    if (siteData.length == 0 || currentID != d.siteid) {
      // console.log("rollup- adding new site");
      var newSite = {};
      currentSite = newSite;
      currentID = d.siteid;
      for (var p in siteObject) {
        if (siteObject.hasOwnProperty(p)) {
          newSite[p] = d[p];
        }
      }
      // console.log("add latitude");
      // add latitude
      if (newSite.latitudenorth != null && newSite.latitudesouth != null) {
        newSite.latitude = +roundTo((newSite.latitudenorth + newSite.latitudesouth) / 2, 6)
      } else {
        newSite.latitude = null;
      }
      // add longitude
      if (newSite.longitudeeast != null && newSite.longitudewest != null) {
        newSite.longitude = +roundTo((newSite.longitudeeast + newSite.longitudewest) / 2, 6)
      } else {
        newSite.longitude = null;
      }
      // console.log("newSite obj "+ JSON.stringify(newSite))
      newSite.datasets = [];
      // add dataset
      var newDataset = {};
      newDataset.ageoldest = d.ageoldest;
      newDataset.ageyoungest = d.ageyoungest;
      newDataset.collunithandle = d.collunithandle;
      newDataset.databasename = d.databasename;
      newDataset.datasetid = d.datasetid;
      newDataset.datasettype = d.datasettype;
      newDataset.maxage = d.maxage;
      newDataset.minage = d.minage;
      newSite.datasets.push(newDataset);
      siteData.push(newSite);
    } else {
      // add dataset
      var newDataset = {};
      newDataset.ageoldest = d.ageoldest;
      newDataset.ageyoungest = d.ageyoungest;
      newDataset.collunithandle = d.collunithandle;
      newDataset.databasename = d.databasename;
      newDataset.datasetid = d.datasetid;
      newDataset.datasettype = d.datasettype;
      newDataset.maxage = d.maxage;
      newDataset.minage = d.minage;
      // console.log("currentSite: "+JSON.stringify(currentSite));
      // console.log("newDataset: "+JSON.stringify(newDataset));
      currentSite.datasets.push(newDataset);
    }
  })
  // console.log("siterollup result: "+JSON.stringify(siteData));
  return siteData;
}

function explorersearch (req, res, next) {
  var data = [];
  // Get the query string:

  // search input param is stringified JSON object, thus parse first
  var inputParamObj = JSON.parse(req.query.search);

  console.dir('req.query.search object: ' + inputParamObj);

  // console.log("Object.entries: "+Object.entries(inputParamObj));

  var qryParams = {
    '_taxonids': null,
    '_elemtypeids': null,
    '_taphtypeids': null,
    '_depenvids': null,
    '_abundpct': null,
    '_datasettypeid': null,
    '_keywordid': null,
    '_coords': null,
    '_gpid': null,
    '_altmin': null,
    '_altmax': null,
    '_coltypeid': null,
    '_dbid': null,
    '_sitename': null,
    '_contactid': null,
    '_ageold': null,
    '_ageyoung': null,
    '_agedocontain': true, // function default true
    '_agedirectdate': false, // function default false
    '_subdate': null,
    '_debug': null
  }

  if (inputParamObj.taxa) {
    // qryParams._taxonids = inputParamObj.taxa.taxonIds;
    qryParams._taxonids = String(inputParamObj.taxa.taxonIds)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
    if (inputParamObj.taxa.abundance) {
      qryParams._abundpct = parseInt(inputParamObj.taxa.abundance.minPercent, 10);
    }
  }

  if (inputParamObj.elementTypes) {
    qryParams._elemtypeids = String(inputParamObj.elementTypes)
      .split(',')
      .map(function (item) {
        return parseInt(item, 10);
      });
    console.dir('qryParams._elementtypeids: ' + qryParams._elemtypeids);
  }

  /* time options
    "time": {
      "ageOlder": 1450,
      "ageYounger": 1830,
      "resultType": "intersects",
      "exactlyDated": false

  */

  if (inputParamObj.time) {
    if (inputParamObj.time.ageOlder) {
      qryParams._ageold = parseInt(inputParamObj.time.ageOlder, 10);
    }
    if (inputParamObj.time.ageYounger) {
      qryParams._ageyoung = parseInt(inputParamObj.time.ageYounger, 10);
    }
    inputParamObj.time.resultType == 'intersects' ? qryParams._agedocontain = false : qryParams._agedocontain = true;
    inputParamObj.time.exactlyDated == true ? qryParams._agedirectdate = true : qryParams._agedirectdate = false;
  }

  /* metadata options:
  "depositionalEnviromentIds": [
        34
      ],
      "collectionTypeId": "3",
      "databaseId": "6",
      "sampleKeywordId": "2",
      "siteName": "A",
      "personId": "44",
      "submitDate": "2018-03-13T11:39:51.232Z"

  */

  if (inputParamObj.metadata) {
    console.log('metadata are:' + JSON.stringify(inputParamObj.metadata));
    if (inputParamObj.metadata.siteName) {
      qryParams._sitename = String(inputParamObj.metadata.siteName);
    }
    if (inputParamObj.metadata.collectionTypeId) {
      qryParams._coltypeid = parseInt(inputParamObj.metadata.collectionTypeId, 10);
    }

    if (inputParamObj.metadata.sampleKeywordId) {
      qryParams._keywordid = parseInt(inputParamObj.metadata.sampleKeywordId, 10);
    }
    if (inputParamObj.metadata.submitDate) {
      qryParams._subdate = String(inputParamObj.metadata.submitDate);
    }
    if (inputParamObj.metadata.personId) {
      qryParams._contactid = parseInt(inputParamObj.metadata.personId, 10);
    }
    if (inputParamObj.metadata.depositionalEnviromentIds) {
      qryParams._depenvids = String(inputParamObj.metadata.depositionalEnviromentIds)
        .split(',')
        .map(function (item) {
          return parseInt(item, 10);
        });
    }
    if (inputParamObj.metadata.databaseId) {
      qryParams._dbid = parseInt(inputParamObj.metadata.databaseId, 10);
    }
  }

  if (inputParamObj.datasetTypeId) {
    qryParams._datasettypeid = parseInt(inputParamObj.datasetTypeId, 10);
  }

  /* space options
   "space": {
      "type": "geoPolitical",
      "gpId": "9283"
    },
  */
  console.dir('have inputParamObj.space' + inputParamObj.space);

  if (inputParamObj.space) {
    console.log('parsing inputParamObj.space');
    // check for geopolitical unit
    if (inputParamObj.space.gpId) {
      qryParams._gpid = parseInt(inputParamObj.space.gpId, 10);
    }
    // check for wkt
    console.log('inputParamObj.space.wkt ' + inputParamObj.space.wkt);
    console.log('qryParams._coords before assignment: ' + qryParams._coords);
    if (inputParamObj.space.wkt) {
      qryParams._coords = String(inputParamObj.space.wkt);
    } else if (inputParamObj.space.bbox) {
      qryParams._coords = String(inputParamObj.space.bbox)
    } else {
      qryParams._coords = null;
    }

    console.log('qryParams._coords after assignment: ' + qryParams._coords);

    // check for maxAltitude
    inputParamObj.space.maxAltitude ? qryParams._altmax = parseInt(inputParamObj.space.maxAltitude, 10) : qryParams._altmax = null;
    // check for minAltitude
    inputParamObj.space.minAltitude ? qryParams._altmin = parseInt(inputParamObj.space.minAltitude, 10) : qryParams._altmin = null;
  }

  console.log('qryParams is: ' + JSON.stringify(qryParams, null, 2));
  console.log('inputParamObj is: ' + JSON.stringify(inputParamObj, null, 2));

  db.any(explorersearchQry, qryParams)
    .then(function (data) {
      if (data.length > 0) {
        data = rollupSites(data);
      }

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
      console.log(err);
      res.status(500)
        .type('application/json')
        .json({
          status: 'failure',
          data: err.message,
          message: 'Ran into an error.'
        })
      return next(err);
    });
}
