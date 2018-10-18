// Sites query:

const path = require('path');

// get global database object
var db = require('../../database/pgp_db');
var pgp = db.$config.pgp;

// Helper for linking to external query files:
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, {minify: true});
}

const chronologybyidsql = sql('./chronologybyid.sql');
const chronologybydsidsql = sql('./chronologybydsid.sql');
const chronologybystidsql = sql('./chronologybystid.sql');

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

      for(i = 0; i < data.length; i++) {

        var ref_obj = data[i].chronology.controls.reduce((acc, item) => {
            if(! acc[item.datasetid]) {
              acc[item.datasetid] = {
                  'datasetid':item.datasetid, 
                'datasettype':item.datasettype, 
                   'controls':[] };
              };

            acc[item.datasetid].controls.push(item.controls.chroncontrols);

            return acc;

          }, {});

        data[i].chronology.controls = ref_obj;
      }

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

function chronologybydsid(req, res, next) {

  if (!!req.params.datasetid) {
    var datasetid = String(req.params.datasetid).split(',').map(function(item) {
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

  db.any(chronologybydsidsql, [datasetid])
    .then(function (data) {

      for(i = 0; i < data.length; i++) {

        var ref_obj = data[i].chronology.controls.reduce((acc, item) => {
            if(! acc[item.datasetid]) {
              acc[item.datasetid] = {
                  'datasetid':item.datasetid, 
                'datasettype':item.datasettype, 
                   'controls':[] };
              };

            acc[item.datasetid].controls.push(item.controls.chroncontrols);

            return acc;

          }, {});

        data[i].chronology.controls = ref_obj;
      }

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


function chronologybystid(req, res, next) {

  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function(item) {
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

  db.any(chronologybystidsql, [siteid])
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
module.exports.chronologybydsid = chronologybydsid;
module.exports.chronologybystid = chronologybystid;