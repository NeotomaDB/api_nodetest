'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/summary/rawbymonth', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A count of the data objects added to Neotoma."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/summary/rawbymonth', {
        'qs': {'start': 1, 'end': 10},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
