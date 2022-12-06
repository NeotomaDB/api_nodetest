'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/taxaindatasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A list of all taxa in neotoma and the datasets in which they are found."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/apps/taxaindatasets', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
