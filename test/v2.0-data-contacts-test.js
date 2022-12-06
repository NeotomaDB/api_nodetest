'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function () {
  describe('tests for get', function () {
    it('should respond 200 for "contact"', function () {
      var response = request('get', 'http://api-dev.neotomadb.org/v2.0/data/contacts', {
        'qs': { 'contactid': 9462, 'familyname': 'dolor proident do eiusmod Duis', 'contactname': 'dolore eu Ut irure', 'contactstatus': 'active', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
