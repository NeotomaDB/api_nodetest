'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites/{siteid}/geopoliticalunits', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of geopolitical units."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/sites/1948/geopoliticalunits', {
        'qs': { 'limit': 94732206, 'offset': 77189269 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
