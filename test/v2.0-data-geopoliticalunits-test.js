'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/geopoliticalunits', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of geopolitical units."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/geopoliticalunits', {
        'qs': { 'gpid': 1935, 'gpname': 'enim proident ut non', 'rank': 4, 'lower': true },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
