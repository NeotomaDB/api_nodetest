'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v1.5/data/geopoliticalunits', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of geopolitical units."', function () {
      var response = request('get', 'http://localhost:3005/v1.5/data/geopoliticalunits', {
        'qs': { 'gpid': 10977, 'gpname': 'occaecat officia consequat Ut', 'rank': 1, 'lower': true },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
