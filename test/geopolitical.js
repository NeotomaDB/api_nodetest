var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Geopolitical Units:
//

describe('Get geopolitical data:', function () {
  // takes a while to run.
  this.timeout(5000);
  it('An empty query redirects to the api documentation.', function (done) {
    api.get('v2.0/data/geopoliticalunits/')
      .set('Accept', 'application/json')
      .expect(302, done);
  });

  it('The default limit of 25 should be reached for country level data:', function (done) {
    api.get('v2.0/data/geopoliticalunits/?rank=1')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        assert.equal(Object.keys(res.body.data.result).length, 25);
        done();
      });
  });

  it('Changing the limit should change the number of countries retrieved:', function (done) {
    api.get('v2.0/data/geopoliticalunits/?rank=1&limit=30')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        assert.equal(Object.keys(res.body.data.result).length, 30);
        done();
      });
  });

  it('A single geopolitical unit (12) should be returned.', function (done) {
    api.get('v2.0/data/geopoliticalunits/12')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        assert.equal(res.body.data[0]['geopoliticalid'], 12);
        done();
      });
  });

});
