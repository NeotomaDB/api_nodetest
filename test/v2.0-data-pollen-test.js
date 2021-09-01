'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/pollen', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/pollen', {
        'qs': { 'taxonname': 'irure est fugiat esse aliquip', 'taxonid': 167, 'siteid': 15200, 'sitename': 'dolore non in deserunt', 'datasettype': 'sit voluptate amet do', 'altmin': 10, 'altmax': 100, 'loc': "{#\\tc_#n'Js}", 'ageof': 12034798, 'ageyoung': 1000, 'ageold': 10000, 'limit': 30271739, 'offset': 93600775 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
