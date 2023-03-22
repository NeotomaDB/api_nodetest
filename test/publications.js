var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

if (typeof process.env.APIPATH === 'undefined') {
  var testroute = 'http://localhost:' + process.env.APIPORT + '/'
} else {
  testroute = process.env.APIPATH
}

var api = supertest(testroute);

// *************************************************
// Site Data:
//

describe('Get publication data any number of ways:', function () {
  this.timeout(15000);

  it('Get publication by singular id & return same id:', function (done) {
    api.get('v2.0/data/publications/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data[0].publication.publicationid === 12;
      })
      .expect(200, done);
  });

  it('Get publication by comma sepatarated ids:', function (done) {
    api.get('v2.0/data/publications/12,13')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.map(x => x.publicationid) == [12, 13];
      })
      .expect(200, done);
  });

  it('Get publication by querying author:', function (done) {
    api.get('v2.0/data/publications?familyname=Grimm')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.result.length > 0;
      })
      .expect(200, done);
  });

  it('Get publications using pubs with missing links:', function (done) {
    api.get('v2.0/data/publications?publicationid=12,14,1412,99999')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.result.length > 0;
      })
      .expect(200, done);
  });

  it('Get publication by site id:', function (done) {
    api.get('v2.0/data/sites/12/publications')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.length > 0;
      })
      .expect(200, done);
  });

  it('Get publication by site id finds pubs for all sites:', function (done) {
    api.get('v2.0/data/sites/12,13,14,15/publications')
      .set('Accept', 'application/json')
      .expect(function (res) {
        const flatten = list => list.reduce(
          (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
        );
        var sites = [12, 13, 14, 15]
        var siteids = flatten(res.body.data.map(x => x.siteid))

        return sites.every(x => siteids.includes(x));
      })
      .expect(200, done);
  });
  it('Get publication by dataset id finds pubs for all datasets:', function (done) {
    api.get('v2.0/data/datasets/12,13,2201,6000/publications')
      .set('Accept', 'application/json')
      .expect(function (res) {
        const flatten = list => list.reduce(
          (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
        );
        var datasets = [12, 6000, 13, 2201]
        var datasetids = flatten(res.body.data.map(x => x.datasetid))

        return datasets.every(x => datasetids.includes(x));
      })
      .expect(200, done);
  });
});
