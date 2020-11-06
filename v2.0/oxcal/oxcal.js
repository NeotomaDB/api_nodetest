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
  command = process.env.OXCALPATH
  fname = crypto.randomBytes(20).toString('hex')
  input = req.body

  hasCurve = !!input.curve
  hasBCAD = !!input.bcad
  hasRound = !!input.round

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
  tempFile = '/tmp/' + fname + '.input'

  calib = `Options()
    {
      Curve = '${input.curve}';
      BCAD = ${input.bcad};
      Round = ${input.round};
    };`

  dateAdds = input.dates.map(x => `R_Date("${x.name}", ${x.date}, ${x.sd});`)

  outputFile = calib + '\n' + dateAdds.join('\n')

  console.log(outputFile)

  fs.writeFileSync(tempFile, outputFile)

  command = `/home/simon/Downloads/OxCal/bin/OxCalLinux ${tempFile}`

  var outputb = exec(command, {
      encoding: 'utf-8'
    })
    .then(function(result) {
      console.log('a');
    })
    .catch(function(err) {
      console.log(err)
    })
    .then(function(result) {
      var filein = fs.readFileSync('/tmp/' + fname + '.txt')
        .toString()
        .split('\n')

      resultOut = filein
        .map(x => x.split('\t'))
        .filter(x => x.length > 5)
        .map(function(x) {
          aa = {name: x[0], sd1: x.slice(1,3), sd2: x.slice(3,5)}
          return aa
        })

      res.status(200)
        .json({
          status: 'success',
          data: resultOut,
          message: 'Retrieved all tables'
        });
    })

}

module.exports.calibrate = calibrate;
