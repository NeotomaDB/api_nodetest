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
        'qs': {'contactid': 9012, 'familyname': 'lxqkkdYw', 'contactname': 'QhjGw,ZgyE', 'contactstatus': 'active', 'limit': 10, 'offset': 0},
=======
        'qs': {'contactid': 15011, 'familyname': 'ea nulla cillum culpa exercitation', 'contactname': 'amet reprehenderit culpa', 'contactstatus': 'unknown', 'limit': 10, 'offset': 0},
>>>>>>> production
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
