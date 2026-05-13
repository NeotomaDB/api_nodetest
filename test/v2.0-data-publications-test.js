'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/publications', { 
                'qs': {"publicationid":4903,"datasetid":19947503,"siteid":38778,"familyname":"'sLglW","pubtype":"Book Chapter","year":1527,"search":"ut sit in mollit","limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});