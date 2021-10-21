'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/geopoliticalunits/{gpid}/datasets', function () {
  describe('tests for get', function () {
    it('should respond 200 for "An array of datasets."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/geopoliticalunits/6919/datasets', {
        'qs': { 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});