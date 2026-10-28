// Building and returning the downloads objects.
// Currently returns only for download selection using dataset IDs.
const { sql, getparam, ifUndef, allIntegers, badRequest } = require('../../../src/neotomaapi.js');

// Largest number of datasets sent in one request when the caller sets no limit.
// A download response can reach tens of megabytes.
const MAX_IDS_WITHOUT_LIMIT = 200;

const downloadsql = sql('../v2.0/helpers/download/downloadbydsid.sql');
const sequencesql = sql('../v2.0/helpers/download/sequencebydata.sql');

function getdefault (chron) {
  const chronorder = [{ 'order': 1, 'agetype': 'Calendar years BP' },
    { 'order': 2, 'agetype': 'Calendar years AD/BC' },
    { 'order': 3, 'agetype': 'Calibrated radiocarbon years BP' },
    { 'order': 4, 'agetype': 'Varve years BP' },
    { 'order': 5, 'agetype': 'Radiocarbon years BP' }]

  // An age type that is not in the list (for example a U-series model) sorts
  // last. It used to throw, which turned the whole download into a 500.
  function quickrank (chronrank) {
    const rank = chronorder.map(x => x['agetype']).indexOf(chronrank['chronology']['chronology']['modelagetype'])
    return rank === -1 ? chronorder.length + 1 : chronorder[rank]['order']
  }

  var chrons = chron
    .filter(x => {
      try {
        return x['chronology']['chronology']['isdefault']
      } catch (error) {
        return false
      }
    })
    .sort((ela, elb) => quickrank(ela) - quickrank(elb))

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
      badRequest(res, 'Must pass either queries or a comma separated integer sequence.');
    } else if (!allIntegers(outobj.datasetid)) {
      badRequest(res, 'datasetid must be an integer or a comma separated list of integers.');
    } else if (outobj.limit === null && outobj.datasetid.length > MAX_IDS_WITHOUT_LIMIT) {
      // Used to return the first 25 and say nothing.
      badRequest(res, 'At most ' + MAX_IDS_WITHOUT_LIMIT + ' datasetid values are accepted ' +
        'per request. Send fewer ids, or page through them with limit and offset.');
    } else {
      // The ids that were asked for are returned; the default limit of 25
      // used to drop the rest without any message.
      if (outobj.limit === null) {
        outobj.limit = outobj.datasetid.length;
      }
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

          // Collect all dataids from datum objects to look up sequenceids
          var allDataIds = [];
          returner.forEach(function (item) {
            try {
              var samples = item.site.collectionunit.dataset.samples;
              if (Array.isArray(samples)) {
                samples.forEach(function (sample) {
                  if (Array.isArray(sample.datum)) {
                    sample.datum.forEach(function (d) {
                      if (d.dataid) { allDataIds.push(d.dataid); }
                    });
                  }
                });
              }
            } catch (e) { /* skip items without samples */ }
          });

          if (allDataIds.length === 0) {
            return res.status(200).json({
              status: 'success',
              data: returner,
              message: 'Retrieved all tables'
            });
          }

          var uniqueDataIds = [...new Set(allDataIds)];

          return db.any(sequencesql, {dataids: uniqueDataIds})
            .then(function (seqData) {
              var seqMap = {};
              seqData.forEach(function (row) {
                seqMap[row.dataid] = row.sequence;
              });

              returner.forEach(function (item) {
                try {
                  var samples = item.site.collectionunit.dataset.samples;
                  if (Array.isArray(samples)) {
                    samples.forEach(function (sample) {
                      if (Array.isArray(sample.datum)) {
                        sample.datum.forEach(function (d) {
                          if (d.dataid && seqMap[d.dataid] !== undefined) {
                            d.sequence = seqMap[d.dataid];
                          }
                        });
                      }
                    });
                  }
                } catch (e) { /* skip */ }
              });

              return res.status(200).json({
                status: 'success',
                data: returner,
                message: 'Retrieved all tables'
              });
            });
        })
        .catch(function (err) {
          res.status(500)
            .json({
              status: 'failure',
              data: null,
              message: err.message
            });
        });
    }
  }
}

module.exports.downloadbyid = downloadbyid;
module.exports.getdefault = getdefault;
