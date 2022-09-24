'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/taxa', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A taxon or array of taxa."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/taxa', {
        'qs': { 'taxonname': 'deserunt consequat sint', 'datasetid': 3185644, 'siteid': 11892 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
