'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v1.5/apps/collectionTypes', function () {
  describe('tests for get', function () {
    it('should respond 200 for "Returns the set of collectiontypes recorded in Neotoma."', function () {
      var response = request('get', 'http://api.neotomadb.org/v1.5/apps/collectionTypes', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
