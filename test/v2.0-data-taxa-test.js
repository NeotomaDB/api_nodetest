'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/taxa', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A taxon or array of taxa."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/taxa', {
        'qs': {'taxonname': 'incididunt Excepteur eiusmod irure', 'taxongroup': 'veniam cillum culpa', 'ecolgroup': 'labore', 'status': 'false', 'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
