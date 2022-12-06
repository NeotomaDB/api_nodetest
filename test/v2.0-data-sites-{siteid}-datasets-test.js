'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites/{siteid}/datasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/sites/9018/datasets', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
