'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v1.5/apps/DatasetTypes', function () {
  describe('tests for get', function () {
    it('should respond 200 for "Returns the set of dataset types supported by Neotoma."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v1.5/apps/DatasetTypes', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
