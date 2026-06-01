'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/aedna/taxa/{taxonid}/sequences', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of aeDNA sequences for the taxon."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/aedna/taxa/500/sequences', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});