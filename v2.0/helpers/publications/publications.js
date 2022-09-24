const db = require('../../../database/pgp_db');

const { sql, validateOut, commaSep, ifUndef } = require('../../../src/neotomaapi.js');

const bib = require('../bib_format');

// Create a QueryFile globally, once per file:
const pubbydsid = sql('../v2.0/helpers/publications/pubdsidquery.sql');
const pubbystid = sql('../v2.0/helpers/publications/pubstidquery.sql');
const pubquery = sql('../v2.0/helpers/publications/pubquery.sql');
const rawpub = sql('../v2.0/helpers/publications/pubidquery.sql');

/* By publication ID directly: .../v2.0/data/publications/1001 */
function publicationid (req, res, next) {
  var pubIdUsed = !!req.params.pubid;

  if (pubIdUsed) {
    var pubid = {
      pubid: commaSep(req.params.pubid)
    };
  }

  db.any(rawpub, pubid)
    .then(function (data) {
      var bibOutput = data

      res.status(200)
        .json({
          status: 'success',
          data: bibOutput,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message
        });
    });
};

/* To query by publication: */
function publicationquery (req, res, next) {
  var outobj = {
    'publicationid': ifUndef(req.query.publicationid, 'sep'),
    'datasetid': ifUndef(req.query.datasetid, 'sep'),
    'siteid': ifUndef(req.query.siteid, 'sep'),
    'doi': ifUndef(req.query.doi, 'sep'),
    'familyname': ifUndef(req.query.familyname, 'sep'),
    'pubtype': ifUndef(req.query.pubtype, 'sep'),
    'year': ifUndef(req.query.year, 'sep'),
    'search': String(req.query.search),
    'limit': parseInt(req.query.limit || 25),
    'offset': parseInt(req.query.offset || 0)
  };

  if (!!outobj.year) {
    outobj.year = outobj.year.map(x => String(x))
  }

  outobj = validateOut(outobj);

  var novalues = Object.keys(outobj).every(function (x) {
    return typeof outobj[x] === 'undefined' || !outobj[x];
  });

  if (novalues === true) {
    if (!!req.accepts('json') & !req.accepts('html')) {
      res.redirect('/swagger.json');
    } else {
      res.redirect('/api-docs');
    };
  } else {
    db.any(pubquery, outobj)
      .then(function (data) {
        var returner = data;

        res.status(200)
          .json({
            status: 'success',
            data: { query: outobj, result: returner },
            message: 'Publications returned'
          });
      })
      .catch(function (err) {
        return res.status(500)
          .json({
            status: 'failure',
            message: err.message
          });
      });
  };
};

/* To get publications by site: /v2.0/data/sites/1001/publications */

function publicationbysite (req, res, next) {
  var siteIdUsed = !!req.params.siteid;

  if (siteIdUsed) {
    var siteid = commaSep(req.params.siteid);
  } else {
    res.redirect('/api-docs')
  }

  db.any(pubbystid, { 'siteid': siteid })
    .then(function (data) {
      var bibOutput = data.map(x => x.publication);

      let pubs = []

      for (let { siteid, ...cleanOut } of bibOutput) {
        let pubids = pubs.map(x => x.publicationid).indexOf(cleanOut['publicationid'])
        if (pubids === -1) {
          pubs.push(cleanOut)
          pubs[pubs.length - 1]['siteid'] = [siteid]
        } else {
          pubs[pubs.length - 1]['siteid'].push(siteid)
        }
      }

      let returner = pubs.map(x => { return { 'publication': x } })

      res.status(200)
        .json({
          status: 'success',
          data: returner,
          message: 'Retrieved all records.'
        })
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message
        });
    })
};

/* To get publications by dataset: /v2.0/data/datasets/1001/publications */

function publicationbydataset (req, res, next) {
  /*
  Get publications by associated dataset IDs:
  */
  var dsIdUsed = !!req.params.datasetid;

  if (dsIdUsed) {
    var datasetid = commaSep(req.params.datasetid);
  }

  db.any(pubbydsid, [datasetid])
    .then(function (data) {
      // var bibOutput = bib.formatpublbib(data);
      var bibOutput = data;

      /* This is a sequence I use to aggregate the publications by site */
      var returner = [];
      var uniquepubs = bibOutput.map(x => x.publicationid).filter((x, i, a) => a.indexOf(x) === i)

      for (var i = 0; i < uniquepubs.length; i++) {
        returner[i] = { 'publicationid': uniquepubs[i] }
      }

      for (i = 0; i < bibOutput.length; i++) {
        var returnid = returner.map(x => x.publicationid).indexOf(bibOutput[i].publicationid)

        if (!('title' in returner[returnid])) {
          /* Using `title` as a placeholder for any record that hasn't been added. */
          returner[returnid] = bibOutput[i]
          returner[returnid].datasetid = [returner[returnid].datasetid]
        } else {
          returner[returnid]['datasetid'].push(bibOutput[i].datasetid);
        }
      }

      res.status(200)
        .json({
          status: 'success',
          data: bibOutput,
          message: 'Retrieved all tables'
        });
    })
    .catch(function (err) {
      return res.status(500)
        .json({
          status: 'failure',
          message: err.message
        });
    });
}

module.exports.publicationbydataset = publicationbydataset;
module.exports.publicationbysite = publicationbysite;
module.exports.publicationid = publicationid;
module.exports.publicationquery = publicationquery;
