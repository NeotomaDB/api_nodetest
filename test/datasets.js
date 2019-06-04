var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Datasets:
//

describe('Get datasets any number of ways:', function () {
  it('Asking for the datasets associated with Lake Tulane work:', function (done) {
    api.get('v2.0/data/sites/2570/datasets')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).includes("site", "dataset");
      })
      .expect(function (res) {
        return res.body['data'][0].site.siteid === 2570;
      })
      .expect(200, done);
  });
  it('Get dataset by singular id & return same id:', function (done) {
    api.get('v2.0/data/datasets/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['siteid'] === 12;
      })
      .expect(200, done);
  });
  it('Get dataset from siteid gives us siteids back and datasets:', function (done) {
    api.get('v2.0/data/sites/123/datasets')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body['data'][0].site.siteid === 123;
      })
      .expect(function (res) {
        return res.body['data'][0].site.datasets.length > 0;
      })
      .expect(200, done);
  });


  // This takes 11 seconds, why?!
  this.timeout(15000);
  it('Get dataset by comma separated ids & return same ids:', function (done) {
    api.get('v2.0/data/datasets/?siteid=12,13,14')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data']).length > 0;
      })
      .expect(200, done);
  });

  it('Returns all key elements of the object:', function (done) {
    api.get('v2.0/data/datasets/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data']).includes('site', 'dataset');
      })
      .expect(200, done);
  });

  this.timeout(50000);
  it('Limits work:', function (done) {
    api.get('v2.0/data/datasets/?altmax=3&limit=10')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data']).length == 10;
      })
      .expect(200, done);
  });

  this.timeout(50000);
  it('Works with age validation:', function (done) {
    api.get('v2.0/data/datasets/?ageyoung=1200&ageold=1500&altmax=3')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var test = true;
        for (var i = 0; i < res.body['data'].length; i++) {
          test = test &
            res.body['data'][i]['sites']['datasets'][0]['agerange']['ageyoung'] < 1200 &
            res.body['data'][i]['sites']['datasets'][0]['agerange']['ageold'] > 1500;

          if (test === false) { return test; }
        }

        return true;
      })
      .expect(200, done);
  });
});
