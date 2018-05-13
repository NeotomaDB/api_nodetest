var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/');

// *************************************************
// Occurrence Data:
//

describe('Get occurrence data any number of ways:', function () {
  this.timeout(15000);

  it('Get occurrence by singular id & return same id:', function (done) {
    api.get('v2.0/data/occurrence/12')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(function (res) {
        return res.body['data'][0]['occurrence'] === 12;
      })
      .expect(200, done);
  });

  it('Get occurrence by taxon:', function (done) {
    api.get('v2.0/data/taxa/12/occurrence')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(200, done);
  });

  it('Break occurrences by flipping altitudes:', function (done) {
    api.get('v2.0/data/occurrence/?altmax=3000&altmin=5000')
      .set('Accept', 'application/json')
      .expect(500, done);
  });
  it('Break occurrences by flipping ages:', function (done) {
    api.get('v2.0/data/occurrence/?ageyoung=5000&ageold=3000')
      .set('Accept', 'application/json')
      .expect(500, done);
  });

  it('Get occurrences with comma separated fields:', function (done) {
    api.get('v2.0/data/occurrence/?siteid=12,13,14,15&taxonname=Betula&limit=200')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var allSite = res.body['data'];
        var siteids = [];
        for (var i = 0; i < allSite.length; i++) {
          siteids.push(allSite[i]['site']['siteid']);
        };
        var uniqueSites = Array.from(new Set(siteids)).sort(function (a, b) { return a - b; });
        return (uniqueSites === [12, 13, 14, 15]);
      })
      .expect(200, done);
  });

  it('Get occurrences with comma separated taxa:', function (done) {
    api.get('v2.0/data/occurrence/?taxonid=12,13,14,15&limit=200')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var allSite = res.body['data'];
        var siteids = [];
        for (var i = 0; i < allSite.length; i++) {
          siteids.push(allSite[i]['site']['siteid']);
        };
        var uniqueSites = Array.from(new Set(siteids)).sort(function (a, b) { return a - b; });
        return (uniqueSites === [12, 13, 14, 15]);
      })
      .expect(200, done);
  });

  it('Get occurrences returns lower taxa:', function (done) {
    api.get('v2.0/data/occurrence/?taxonname=Myrica&lower=true&limit=200')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var allTaxa = res.body['data'];
        var taxaids = [];
        for (var i = 0; i < allTaxa.length; i++) {
          taxaids.push(allTaxa[i]['sample']['taxonname']);
        };
        var uniqueTaxa = Array.from(new Set(taxaids)).sort();
        return uniqueTaxa.length > 1;
      })
      .expect(200, done);
  });

  it('Get occurrences with mammals and lower taxa works:', function (done) {
    api.get('v2.0/data/occurrence/?taxonname=Homo&lower=true&limit=25')
      .set('Accept', 'application/json')
      .expect(function (res) {
        var allTaxa = res.body['data'];
        var taxaids = [];
        for (var i = 0; i < allTaxa.length; i++) {
          taxaids.push(allTaxa[i]['sample']['taxonname']);
        };
        var uniqueTaxa = Array.from(new Set(taxaids)).sort();
        return uniqueTaxa.length > 1 & allTaxa.length > 0;
      })
      .expect(200, done);
  });

  it('Get occurrences using taxon and age bounds:', function (done) {
    api.get('v2.0/data/occurrence/?ageyoung=2000&ageold=3000&taxonname=Pinus')
      .set('Accept', 'application/json')
      .expect(function (res) {
        return Object.keys(res.body['data'][0]).length > 0;
      })
      .expect(200, done);
  });
});
