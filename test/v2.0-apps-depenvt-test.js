'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/depenvt', function() {
    describe('tests for get', function() {
        it('should respond 200 for "This returns the information about depositional environment for selected dataset/collection unit/site."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/apps/depenvt', { 
                'qs': {"siteid":8235,"datasetid":12990720,"collectionunitid":17491},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});