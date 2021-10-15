// Building and returning the downloads objects.
// Currently returns only for download selection using dataset IDs.

const {
  sql,
  commaSep
} = require('../../../src/neotomaapi.js');

const downloadsql = sql('../v2.0/helpers/download/downloadbydsid.sql');

function getdefault (chron) {
  function quickrank (chronrank) {
    let chronorder = [{ 'order': 1, 'agetype': 'Calendar years BP' },
      { 'order': 2, 'agetype': 'Calibrated radiocarbon years BP' },
      { 'order': 3, 'agetype': 'Varve years BP' },
      { 'order': 4, 'agetype': 'Radiocarbon years BP' }]

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
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = commaSep(req.params.datasetid);
  } else {
    res.status(500)
      .json({
        status: 'failure',
        data: null,
        message: 'Must pass either queries or a comma separated integer sequence.'
      });
  }

  db.any(downloadsql, [datasetid])
    .then(function (data) {
      var returner = data.map(x => {
        if (x.length === 0) {
          // We're returning the structure, but nothing inside it:
          var returner = [];
        } else {
          returner = {
            'site': x.data.data.dataset.site,
            'samples': x.data.data.samples
          };
          returner['chronologies'] = x.data.chronologies
          var defaultchron = getdefault(returner['chronologies'])
          returner['site']['collectionunit']['defaultchronology'] = defaultchron
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
      next(err);
    });
}

module.exports.downloadbyid = downloadbyid;
