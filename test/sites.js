var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Site Data:
//

describe('Get site data any number of ways:', function () {
  // takes a while to run.

  this.timeout(5000);
  it('Get site by singular id & return same id:', function (done) {
    api.get('v2.0/data/sites/12')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body['data'][0]['siteid'] === 12 & Object.keys(res.body['data'][0]).length > 0);
        done();
      });
  });

  it('Get site by altitude:', function (done) {
    api.get('v2.0/data/sites/?altmax=5000&altmin=3000')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.log(err);
          done();
        } else {
          expect(Object.keys(res.body['data'][0]).length > 0);
          done();
        };
      });
  });

  it('Break sites by flipping altitudes:', function (done) {
    api.get('v2.0/data/sites/?altmax=3000&altmin=5000') 
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.log(err);
          done();
        } else {
          expect(res.body.status === 'failure');
          done();
        };
      });
  });

  it('Break sites by passing invalid siteid:', function (done) {
    api.get('v2.0/data/sites/abcd')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          console.log(err);
          done();
        } else {
          expect(500, done);
          done();
        }
      });
  });

  it('Get site by geopolitical units returns gp and site data:', function (done) {
    api.get('v2.0/data/geopoliticalunits/765/sites')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length === 2;
      })
      .expect(200, done);
  });
  it('Get site by contact information for multiple authors:', function (done) {
    api.get('v2.0/data/contacts/12,13/sites')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length === 2;
      })
      .expect(200, done);
  });
});
