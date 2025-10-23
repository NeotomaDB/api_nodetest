'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/datasets/{datasetid}/taxa', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Taxa"', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/datasets/500/taxa', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
