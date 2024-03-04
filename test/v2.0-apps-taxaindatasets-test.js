'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/apps/taxaindatasets', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A list of all taxa in neotoma and the datasets in which they are found."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/apps/taxaindatasets', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
