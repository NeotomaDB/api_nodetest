// Building and returning the downloads objects.
// Currently returns only for download selection using dataset IDs.
const { sql, getparam, ifUndef } = require('../../../src/neotomaapi.js');

const downloadsql = sql('../v2.0/helpers/download/downloadbydsid.sql');

function getdefault (chron) {
  function quickrank (chronrank) {
    let chronorder = [{ 'order': 1, 'agetype': 'Calendar years BP' },
      { 'order': 2, 'agetype': 'Calendar years AD/BC' },
      { 'order': 3, 'agetype': 'Calibrated radiocarbon years BP' },
      { 'order': 4, 'agetype': 'Varve years BP' },
      { 'order': 5, 'agetype': 'Radiocarbon years BP' }]

    const rank = chronorder.map(x => x['agetype']).indexOf(chronrank['chronology']['chronology']['modelagetype'])

    return chronorder[rank]['order']
  }

  var chrons = chron
    .filter(x => {
      try {
        return x['chronology']['chronology']['isdefault']
      } catch (error) {
        return false
      }
    })
    .sort((ela, elb) => quickrank(ela) > quickrank(elb))

  if (chrons.length === 0) {
    return null;
  } else {
    return chrons[0]['chronology']['chronologyid'];
  }
}

function downloadbyid (req, res, next) {
  let db = req.app.locals.db
  let paramgrab = getparam(req)
  if (!paramgrab.success) {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: paramgrab.message
      });
  } else {
    var resultset = paramgrab.data
    var outobj = {
      'datasetid': ifUndef(resultset.datasetid, 'sep'),
      'offset': ifUndef(resultset.offset, 'int'),
      'limit': ifUndef(resultset.limit, 'int')
    };

    if (outobj.datasetid === null) {
      res.status(500)
        .json({
          status: 'failure',
          data: null,
          message: 'Must pass either queries or a comma separated integer sequence.'
        });
    } else {
      db.any(downloadsql, outobj)
        .then(function (data) {
          var returner = data.map(x => {
            if (x.length === 0) {
              // We're returning the structure, but nothing inside it:
              var returner = [];
            } else {
              returner = {
                // To avoid deep copy we need to pass the variable through:
                'site': JSON.parse(JSON.stringify(x.data.data))['site']
              };

              // delete returner.site.dataset;
              returner['site']['collectionunit']['dataset'] = x.data.data.site.dataset;
              returner['site']['collectionunit']['chronologies'] = x.data.chronologies;
              var defaultchron = getdefault(returner['site']['collectionunit']['chronologies'])
              returner['site']['collectionunit']['defaultchronology'] = defaultchron
              returner['site']['collectionunit']['dataset']['samples'] = x.data.data.samples
            }
            return returner;
          })
          res.status(200)
            .json({
              status: 'success',
              data: returner,
              message: 'Retrieved all tables'
            });
        })
        .catch(function (err) {
          res.status(500)
            .json({
              status: 'failure',
              data: err.message,
              message: 'SQL Error.'
            });
        });
    }
  }
}

module.exports.downloadbyid = downloadbyid;
