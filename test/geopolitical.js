const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

if (typeof process.env.APIPATH === 'undefined') {
  var testroute = 'http://localhost:' + process.env.APIPORT + '/';
} else {
  testroute = process.env.APIPATH;
}

const api = supertest(testroute);

// *************************************************
// Geopolitical Units:
//

describe('Get geopolitical data:', function() {
  // takes a while to run.
  this.timeout(5000);
  it('An empty query returns a valid response.', function(done) {
    api.get('v2.0/data/geopoliticalunits/')
        .set('Accept', 'application/json')
        .expect(200, done);
  });

  it('The default limit of 25 should be reached for country level data:', function(done) {
    api.get('v2.0/data/geopoliticalunits/?rank=1')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.equal(res.body.data.length, 25);
          done();
        });
  });

  it('Changing the limit should change the number of countries retrieved:', function(done) {
    api.get('v2.0/data/geopoliticalunits/?rank=1&limit=30')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.equal(res.body.data.length, 30);
          done();
        });
  });

  it('A single geopolitical unit (12) should be returned.', function(done) {
    api.get('v2.0/data/geopoliticalunits/12')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.equal(res.body.data[0]['geopoliticalid'], 12);
          done();
        });
  });
});
