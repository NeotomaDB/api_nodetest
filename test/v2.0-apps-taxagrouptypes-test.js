'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/taxagrouptypes', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A table of Neotoma collection types."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/taxagrouptypes', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
