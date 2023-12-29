'use strict';
const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

describe('tests for /v2.0/data/frozen/{datasetid}', function() {
  describe('tests for get', function() {
    it('should respond 200 for "Returned download object."', function() {
      const response = request('get', 'http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/v2.0/data/frozen/500', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
