'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/summary/dstypemonth', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A count of the datasets added by datasettype for the requested period."', function () {
      var response = request('get', 'http://localhost:3005/v2.0/data/summary/dstypemonth', {
        'qs': { 'start': 0, 'end': 1 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
