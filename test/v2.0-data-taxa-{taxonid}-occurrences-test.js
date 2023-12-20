'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/taxa/{taxonid}/occurrences', function() {
  describe('tests for get', function() {
    it('should respond 200 for "occurrence"', function() {
      const response = request('get', 'http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/v2.0/data/taxa/500/occurrences', {
        'qs': {'limit': 10, 'offset': 0},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
