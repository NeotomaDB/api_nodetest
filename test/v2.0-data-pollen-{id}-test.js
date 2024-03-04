'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/pollen/{id}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/pollen/500', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
