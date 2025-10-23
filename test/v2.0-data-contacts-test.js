'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/contacts', function() {
  describe('tests for get', function() {
    it('should respond 200 for "contact"', function() {
      const response = request('get', 'http://localhost:3001/v2.0/data/contacts', {
<<<<<<< HEAD
        'qs': {'contactid': 9073, 'familyname': 'buiPy-Uu', 'contactname': 'dRKsruc', 'contactstatus': 'retired', 'limit': 10, 'offset': 0},
=======
        'qs': {'contactid': 1353, 'familyname': 'wc', 'contactname': 'qToDPKY\'lu', 'contactstatus': 'extant', 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
