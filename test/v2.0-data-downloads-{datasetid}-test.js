'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/downloads/{datasetid}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Returned download object."', function() {
            var response = request('get', 'http://localhost:3005/v2.0/data/downloads/56730169', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});