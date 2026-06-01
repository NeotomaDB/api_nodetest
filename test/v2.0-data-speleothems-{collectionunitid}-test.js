'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/speleothems/{collectionunitid}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Metadata associated with speleothems submitted through SISAL."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/speleothems/8805', { 
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});