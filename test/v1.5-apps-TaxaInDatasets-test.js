'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v1.5/apps/TaxaInDatasets', function() {
  describe('tests for get', function() {
    it('should respond 200 for "An array of taxon identities with associated dataset IDs."', function() {
      const response = request('get', 'http://localhost:3001/v1.5/apps/TaxaInDatasets', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
