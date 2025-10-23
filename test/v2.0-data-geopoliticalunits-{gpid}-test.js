'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/geopoliticalunits/{gpid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "An array of geopolitical units."', function() {
<<<<<<< HEAD
      const response = request('get', 'http://localhost:3001/v2.0/data/geopoliticalunits/413', {
=======
      const response = request('get', 'http://localhost:3001/v2.0/data/geopoliticalunits/2539', {
>>>>>>> develop
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
