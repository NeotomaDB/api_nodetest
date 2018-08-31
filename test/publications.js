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
        return res.body.data[0].publicationid == 12;
      })
      .expect(200, done);
  });

  it('Get publication by comma sepatarated ids:', function (done) {
    api.get('v2.0/data/publications/12,13')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.map(x => x.publicationid) == [12,13];
      })
      .expect(200, done);
  });

  it('Get publication by querying author:', function (done) {
    api.get('v2.0/data/publications/?familyname=Grimm')
      .set('Accept', 'application/json')
      .expect(function (res) {
        console.log(res.body.data)
        return res.body.data.result.length > 0;
      })
      .expect(200, done);
  });

  it('Get publications using pubs with missing links:', function (done) {
    api.get('v2.0/data/publications/?pubid=12,14,1412')
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

    it('Get publication by site id:', function (done) {
    api.get('v2.0/data/sites/12,13,14,15/publications')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return res.body.data.length > 0;
      })
      .expect(200, done);
  });
});
