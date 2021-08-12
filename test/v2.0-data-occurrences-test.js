'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/occurrences', function() {
    describe('tests for get', function() {
        it('should respond 200 for "occurrence"', function() {
            var response = request('get', 'http://localhost:3005/v2.0/data/occurrences', { 
                'qs': {"taxonname":"enim officia magna Duis ullamco","taxonid":46237,"siteid":28440,"sitename":"dolore","datasettype":"occaecat et nisi","altmin":5848,"altmax":619,"loc":"{JC|@}","ageof":18245875,"ageyoung":6306282,"ageold":17057338,"limit":2325594,"offset":30530333},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});