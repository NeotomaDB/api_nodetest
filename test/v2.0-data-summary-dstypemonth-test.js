'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/summary/dstypemonth', function() {
  describe('tests for get', function() {
    it('should respond 200 for "A count of the datasets added by datasettype for the requested period."', function() {
      const response = request('get', 'http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/v2.0/data/summary/dstypemonth', {
        'qs': {'start': 1, 'end': 10},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
