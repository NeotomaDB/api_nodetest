'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/chronologies/{chronid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A Neotoma chronology object."', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/chronologies/500', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
