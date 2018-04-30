var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Datasets:
//

describe('Get datasets any number of ways:', function () {
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
  it('Returns all key elements of the object:', function (done) {
    api.get('v2.0/data/datasets/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data']).includes('site', 'dataset');
      })
      .expect(200, done);
  });

  this.timeout(50000);
  it('Works with age validation:', function (done) {
    api.get('v2.0/data/datasets/?ageyoung=1200&ageold=4000&altmax=3')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var test = true;

        for (var i = 0; i < res.body['data'].length; i++) {
          test = test &
            res.body['data'][i]['dataset'][0]['agerange']['ageyoung'] < 1200 &
            res.body['data'][i]['dataset'][0]['agerange']['ageold'] > 4000;

          if (test === false) { return test; }
        }

        return true;
      })
      .expect(200, done);
  });
});
