'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/taxa/{taxonid}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A taxon or array of taxa."', function() {
            var response = request('get', 'http://localhost:3005/v2.0/data/taxa/28736', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});