'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/occurrences/{occurrenceid}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "occurrence"', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/occurrences/6002377', { 
                'qs': {"limit":86,"offset":87344435},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});