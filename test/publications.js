var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Site Data:
//

describe('Get publication data any number of ways:', function () {
  this.timeout(15000);

  it('Get publication by singular id & return same id:', function (done) {
    api.get('v2.0/data/publications/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['publicationid'] === 12;
      })
      .expect(200, done);
  });
});
