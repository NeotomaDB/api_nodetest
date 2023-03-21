'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v1.5/data/sites/{siteid}', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of site elements."', function () {
      var response = request('get', 'http://api.neotomadb.org/v1.5/data/sites/4705', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
