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
// Taxon Data:
//

describe('Get taxon data:', function() {
  it('v2.0: An empty query returns the first 25 taxa.', function(done) {
    api.get('v2.0/data/taxa/')
        .set('Accept', 'application/json')
        .expect(200, done);
  });

  it('v2.0: A single taxon should be returned by id:', function(done) {
    api.get('v2.0/data/taxa/12')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data[0]['taxonid'], 12);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: Taxon queries should be case insensitive:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=abies')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data[0]['taxonid'], 1);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: Taxon queries should accept comma separated lists:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=abies,picea')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data[0]['taxonid'], 1);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: Hierarchical taxon queries should accept comma separated lists:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=abies,picea&lower=true')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data[0]['taxonid'], 1);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: Taxon queries should accept `*` as a wildcard:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=abie*')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data[0]['taxonid'], 1);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: The default limit of 25 should be reached for taxon data:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=a*')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data.length, 25);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });

  it('v2.0: Changing the limit should change the number of taxa retrieved:', function(done) {
    api.get('v2.0/data/taxa/?taxonname=a*&limit=30')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          assert.strictEqual(res.body.data.length, 30);
          done();
          if (err) {
            console.log(err.message);
          };
        });
  });
});
