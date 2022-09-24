'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites/{siteid}/datasets_elc', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/sites/9487/datasets_elc', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
