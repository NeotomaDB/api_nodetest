'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/datasets/{datasetid}/sites', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Site"', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/datasets/500/sites', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
