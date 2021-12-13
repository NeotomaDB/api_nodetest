'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/datasets', {
        'qs': { 'siteid': 7759, 'contactid': 5264, 'datasettype': 'aute esse id nisi', 'altmin': 10, 'altmax': 100, 'loc': "{=.\"TT:y''u}", 'ageyoung': 1000, 'ageold': 10000, 'ageof': 11351484 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
