'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/geopoliticalunits/{gpid}/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/geopoliticalunits/8803/datasets', { 
                'qs': {"limit":4603,"offset":17396337},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});