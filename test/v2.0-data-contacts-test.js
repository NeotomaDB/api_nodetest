'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function() {
  describe('tests for get', function() {
    it('should respond 200 for "contact"', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/contacts', {
        'qs': {'contactid': 15167, 'familyname': 'ea', 'contactname': 'dolor eiusmod culpa', 'contactstatus': 'inactive', 'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
