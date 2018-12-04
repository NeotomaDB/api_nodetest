// Chroncontrol query:
// Should return the chron controls and also the geochron data.

const path = require('path');

// get global database object
var db = require('../../../database/pgp_db');
var pgp = db.$config.pgp;

/* A function to remove null elements. */

const removeEmpty = function (obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
};

// Helper for linking to external query files:
function sql (file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
}

const chronologybyidsql = sql('./chronologybyid.sql');
const chronologybydsidsql = sql('./chronologybydsid.sql');
const chronologybystidsql = sql('./chronologybystid.sql');

function chronologybyid (req, res, next) {
  if (!(req.params.chronologyid == null)) {
    var chronologyid = String(req.params.chronologyid).split(',').map(function (item) {
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
      for (var i = 0; i < data.length; i++) {
        var refObj = data[i].chronology.controls.reduce((acc, item) => {
          if (!acc[item.datasetid]) {
            acc[item.datasetid] = {
              'datasetid': item.datasetid,
              'datasettype': item.datasettype,
              'controls': [] };
          };

          acc[item.datasetid].controls.push(item.controls.chroncontrols);

          return acc;
        }, {});

        data[i].chronology.controls = refObj;
      }

      res.status(200)
        .json({
          status: 'success',
          data: removeEmpty(data),
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function chronologybydsid (req, res, next) {

  if (!(req.params.datasetid == null)) {
    var datasetid = String(req.params.datasetid).split(',').map(function (item) {
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

  /* The query returns a big long table. */

  db.any(chronologybydsidsql, [datasetid])
    .then(function (data) {
      var dataSets = datasetid.map(function (x) {
        var out = { datasetid: x }
        return out;
      })

      for (var i = 0; i < dataSets.length; i++) {
        /* Get all objects (rows) in data that are associated with the dataset: */
        var newchrons = data.filter(obj => {
          return obj.datasetid === dataSets[i]['datasetid']
        })

        var dschrons = newchrons.map(obj => obj['chronologyid']).filter((x, i, a) => a.indexOf(x) === i)

        if (dschrons.length > 0) {
          /* Get the unique chronologies for the dataset and create objects */
          dataSets[i]['chronologies'] = dschrons.map(function (x) {
            return { chronologyid: x }
          })

          for (var j = 0; j < dschrons.length; j++) {
            var chronset = data.filter(obj => {
              return obj.datasetid === dataSets[i]['datasetid'] & obj.chronologyid === dataSets[i]['chronologies'][j]['chronologyid']
            })

            /* var ccrid = chronset.map(x => x['chroncontrolid']).filter((x, i, a) => a.indexOf(x) === i) */

            dataSets[i]['chronologies'][j] = { 'chronologyid': chronset[0]['chronologyid'],
              agetype: chronset[0]['modelagetype'],
              agemodel: chronset[0]['agemodel'],
              isdefault: chronset[0]['isdefault'],
              chronologyname: chronset[0]['chronologyname'],
              dateprepared: chronset[0]['dateprepared'],
              chronologynotes: chronset[0]['chronologynotes'],
              chronologyagepan: { younger: chronset[0]['ageboundyounger'],
                older: chronset[0]['ageboundolder'] },
              preparedby: {
                contactid: chronset[0]['contactid'],
                familyname: chronset[0]['familyname'],
                firstname: chronset[0]['givennames'],
                initials: chronset[0]['leadinginitials'] },
              controls: chronset.map(function (x) {
                var out = { 'chroncontrolid': x['chroncontrolid'],
                  'depth': x['depth'],
                  'thickness': x['thickness'],
                  'age': x['ccage'],
                  'agelimityounger': x['agelimityounger'],
                  'agelimitolder': x['agelimitolder'],
                  'chroncontroltype': x['chroncontroltype'],
                  'geochron': {
                    'geochronid': x['geochronid'],
                    'labnumber': x['labnumber'],
                    'geochrontype': x['geochrontype'],
                    'age': x['gcage'],
                    'errorolder': x['errorolder'],
                    'erroryounger': x['erroryounger'],
                    'infinite': x['infinite'],
                    'delta13c': x['delta13c'],
                    'agetype': x['geochronagetype'],
                    'notes': x['gcnotes'],
                    'materialdated': x['geochronagetype']
                  }
                }
                return out;
              })
            }
          }
        }
      }
      res.status(200)
        .json({
          status: 'success',
          data: dataSets,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return next(err);
    })
}

function chronologybystid (req, res, next) {
  if (!!req.params.siteid) {
    var siteid = String(req.params.siteid).split(',').map(function (item) {
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
