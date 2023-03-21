'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/summary/dsdbmonth', function () {
  describe('tests for get', function () {
    it('should respond 200 for "A count of the datasets added by database for the requested period."', function () {
      var response = request('get', 'http://api.neotomadb.org/v2.0/data/summary/dsdbmonth', {
        'qs': { 'start': 1, 'end': 10 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
