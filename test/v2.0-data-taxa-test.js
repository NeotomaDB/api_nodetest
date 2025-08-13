'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/taxa', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A taxon or array of taxa."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/taxa', {
        'qs': {'taxonname': 'irure pariatur sunt Excepteur nostrud', 'taxagroup': 'ex labore officia Excepteur minim', 'ecolgroup': 'veniam quis deserunt laborum voluptate', 'status': true, 'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
