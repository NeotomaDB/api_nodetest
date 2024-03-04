'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v1.5/data/occurrence/{occurrenceid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A single occurrence object."', function() {
      const response = request('get', 'http://localhost:3001/v1.5/data/occurrence/500', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
