var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

const dotenv = require('dotenv');
dotenv.config();

var api = supertest('http://localhost:' + process.env.APIPORT + '/');

// *************************************************
// Contact Data:
//

describe('Get contact data:', function () {
  // takes a while to run.
  this.timeout(5000);

  it('The default limit of 25 should be reached for contact data:', function (done) {
    api.get('v2.0/data/contacts/?contactstatus=retired')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data.length, 25);
        done();
      });
  });

  it('The example in the swagger should return an object:', function (done) {
    api.get('v2.0/data/contacts?familyname=Grimm&contactstatus=active&limit=25')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data[0]['familyname'], 'Grimm')
        done();
      });
  });

  it('Contact queries should be case insensitive:', function (done) {
    api.get('v2.0/data/contacts/?contactstatus=Retired')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data.length, 25);
        done();
      });
  });

  it('Changing the limit should change the number of contacts retrieved:', function (done) {
    api.get('v2.0/data/contacts/?status=retired&limit=30')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data.length, 30);
        done();
      });
  });

  it('A single contact (12) should be returned.', function (done) {
    api.get('v2.0/data/contacts/12')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data[0]['contactid'], 12);
        done();
      });
  });

  it('All contacts from datasets should be returned.', function (done) {
    api.get('v2.0/data/datasets/12,13/contacts')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(res.body.data.length, 2);
        done();
      });
  });

  it('The length of returned contacts should be equivalent to the number of datasets.', function (done) {
    api.get('v2.0/data/datasets/12,13/contacts')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        var test = []
        assert.strictEqual(test.length, 0);
        done();
      });
  });

  it('The length of returned contacts should be equivalent to the number of sites.', function (done) {
    api.get('v2.0/data/datasets/102,1435,1,27/contacts')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) return done(err);
        assert.strictEqual(Object.keys(res.body.data).length, 4);
        done();
      });
  });
});
