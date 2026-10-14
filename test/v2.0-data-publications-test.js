'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/publications', { 
                'qs': {"publicationid":9035,"datasetid":12074338,"siteid":31854,"familyname":"%qP","pubtype":"Master's Thesis","year":1622,"search":"ipsum aliqua tempor commodo","limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});