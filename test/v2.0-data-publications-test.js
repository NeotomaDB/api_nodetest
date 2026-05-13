'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/publications', { 
                'qs': {"publicationid":11248,"datasetid":25838920,"siteid":43901,"familyname":"YhlWFYaSz ","pubtype":"Journal Article","year":1866,"search":"elit Duis sit aliqua in","limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});