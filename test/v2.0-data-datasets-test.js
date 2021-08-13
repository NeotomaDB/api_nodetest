'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3005/v2.0/data/datasets', { 
                'qs': {"siteid":24392,"contactid":27142037,"datasettype":"nostrud consectetur","altmin":981,"altmax":8417,"ageyoung":5034891,"ageold":5909591,"ageof":11767893},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});