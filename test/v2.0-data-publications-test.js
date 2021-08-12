'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3005/v2.0/data/publications', { 
                'qs': {"publicationid":75982988,"datasetid":42313061,"siteid":4310,"familyname":"laboris","pubtype":"Doctoral Dissertation","year":1659,"search":"laborum occaecat nulla","limit":17385000,"offset":22013039},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});