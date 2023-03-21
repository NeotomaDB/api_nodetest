'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function () {
  describe('tests for get', function () {
    it('should respond 200 for "contact"', function () {
      var response = request('get', 'http://api.neotomadb.org/v2.0/data/contacts', {
        'qs': { 'contactid': 11802, 'familyname': 'fugiat deserunt laboris', 'contactname': 'eiusmod', 'contactstatus': 'active', 'limit': 10, 'offset': 0 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
