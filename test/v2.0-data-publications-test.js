'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/publications', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of publications."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/publications', { 
                'qs': {"publicationid":3227,"datasetid":62171686,"siteid":15473,"familyname":"Tm-","pubtype":"Other Edited","year":1958,"search":"dolor laboris ullamco ut","limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});