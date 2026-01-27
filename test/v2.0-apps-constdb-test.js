'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/constdb', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Returns metadata about each [constituent database](https://www.neotomadb.org/data/constituent-databases) in Neotoma, including Summary Information about dataset types within the database and the age spans of the records in the database. Constituent databases "', function() {
            var response = request('get', 'http://localhost:3001/v2.0/apps/constdb', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});