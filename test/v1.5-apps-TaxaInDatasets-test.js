'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v1.5/apps/TaxaInDatasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of taxon identities with associated dataset IDs."', function () {
      var response = request('get', 'http://api.neotomadb.org/v1.5/apps/TaxaInDatasets', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
