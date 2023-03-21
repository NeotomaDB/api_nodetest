'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/pollen/{id}', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A record of all pollen samples in time/space for a particular taxon."', function () {
      var response = request('get', 'http://api.neotomadb.org/v2.0/data/pollen/{id}', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
