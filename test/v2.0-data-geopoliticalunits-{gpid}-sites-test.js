'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/geopoliticalunits/{gpid}/sites', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of sites."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/geopoliticalunits/98049872/sites', {
        'qs': { 'limit': 64492091, 'offset': 27471150 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
