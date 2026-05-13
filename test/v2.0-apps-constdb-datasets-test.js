'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/constdb/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Returns the set of datasets contained within a constituent database, identified by the constituent database identifier. Used for quick landing page generation. "', function() {
            var response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasets', { 
                'qs': {"dbid":8},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});