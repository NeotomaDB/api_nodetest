'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets/{datasetid}/projects', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Projects"', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets/500/projects', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});