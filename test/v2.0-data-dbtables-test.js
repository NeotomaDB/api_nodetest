'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/dbtables', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Returned table."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/dbtables', { 
                'qs': {"table":"Excepteur Duis","count":false,"limit":2440,"offset":73056327},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});