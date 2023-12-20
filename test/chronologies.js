const assert = require('chai').assert;

const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

if (typeof process.env.APIPATH === 'undefined') {
  var testroute = process.env.APIPORT + '/';
} else {
  testroute = process.env.APIPATH;
}

const api = supertest(testroute);

// *************************************************
// Chronology Data:
//

describe('Get chronology data by datasetid:', function() {
  // takes a while to run.
  this.timeout(5000);
  it('A call to two datasets returns two datasets of data:', function(done) {
    api.get('v2.0/data/datasets/684,1001/chronologies')
        .set('Accept', 'application/json')
        .expect(function(res) {
          return res.body['data'].length === 4;
        })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
  });
});
