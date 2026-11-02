'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/publications', { 
                'qs': {"publicationid":9698,"datasetid":17022176,"siteid":37912,"familyname":"T","pubtype":"Book Chapter","year":1933,"search":"ut consectetur est","limit":7270,"offset":69060830},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});