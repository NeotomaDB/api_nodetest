'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v1.5/data/geopoliticalunits', function() {
  describe('tests for get', function() {
    it('should respond 200 for "An array of geopolitical units."', function() {
      const response = request('get', 'http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/v1.5/data/geopoliticalunits', {
        'qs': {'gpid': 756, 'gpname': 'Canada', 'rank': 3, 'lower': false},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
