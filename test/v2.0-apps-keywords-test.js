'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/keywords', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of all keywords used for analysis units in the database."', function () {
      var response = request('get', 'http://api.neotomadb.org/v2.0/apps/keywords', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
