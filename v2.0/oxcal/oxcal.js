const path = require('path')
const tmp = require('tmp');
const fs = require('fs');
var crypto = require("crypto");
var exec = require('child-process-promise').exec;

function calibrate(req, res, next) {
  // This function takes in an object with three parameters:
  // {"curve":"IntCal20.14c",
  //  "bcad":true,
  //  "dates":[{"name":"CAMS-007","date":2560,"sd":25},
  //           {"name":"CAMS-008","date":5620,"sd":40}],
  //  "round":false}
  // It returns four elements:
  // T	-401.5	-393.5	-407	-389.5
  // The function must write to an `input` file (using a random hash in `tmp`),
  // and then read from the output file, splitting by spaces.
  let command = process.env.OXCALPATH
  let fname = crypto.randomBytes(20).toString('hex')
  let input = JSON.parse(req.query.calib)

  let hasCurve = !!input.curve
  let hasBCAD = !!input.bcad
  let hasRound = !!input.round

  if (hasCurve) {
    input.curve = input.curve.toLowerCase()
  } else {
    input.curve = 'intcal20.14c'
  }

  if (hasRound) {
    if (input.round) {
      input.round = 'TRUE'
    } else {
      input.round = 'FALSE'
    }
  } else {
    input.round = 'FALSE'
  }

  if (hasBCAD) {
    if (input.bcad) {
      input.bcad = 'TRUE'
    } else {
      input.bcad = 'FALSE'
    }
  } else {
    input.bcad = 'FALSE'
  }

  // Assume that the input is ordered:
  let tempFile = '/tmp/' + fname + '.input'

  let calib = `Options()
    {
      Curve = '${input.curve}';
      BCAD = ${input.bcad};
      Round = ${input.round};
    };`

  let dateAdds = input.dates.map(x => `R_Date("${x.name}", ${x.date}, ${x.sd});`)

  let outputFile = calib + '\n' + dateAdds.join('\n')

  fs.writeFileSync(tempFile, outputFile)

  command = command + ` ${tempFile}`

  var outputb = exec(command, {
    encoding: 'utf-8'
  })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'error',
          data: err.message,
          message: 'Hit an unexpected error'
        });
      next(err)
    })
    .then(function (x) {
      // We have to read in the `js` file, it's not JSON though, so we have to
      // read it and evaluate it as if it were javascript to be executed.
      fs.readFile('/tmp/' + fname + '.js', {
        encoding: 'utf-8'
      }, function(err, data) {
        if (!err) {
          // create variables to hold oxcal results
          var ocd = [];
          var calib = [];
          var model = null;
          eval(data);

          let curve = model.element[0]['name']

          // Now parse the ages:
          let outputs = ocd.map(function(x) {
            if (!!x.likelihood.range) {
              let result = {name: x.name,
                input: {date: x.date, error: x.error, curve: curve},
                ref: x.ref,
                mean: {mean: x.likelihood.mean, sigma: x.likelihood.sigma},
                median: x.likelihood.median,
                range: x.likelihood.range[2].map(function(x) {
                  let range = { from: x[0], to: x[1], probability: x[2] }
                  return range;
                })
              }
              return result;
            } else {
              return null;
            }
          })
            .filter(function (x) { return x != null })

          res.status(200)
            .json({
              status: 'success',
              data: outputs,
              message: 'Returning calibrated ages'
            });
        }
      })
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'error',
          data: err.message,
          message: 'Hit an unexpected error'
        });
      next(err)
    })
}

module.exports.calibrate = calibrate;
