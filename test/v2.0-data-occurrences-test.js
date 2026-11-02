'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/occurrences', function() {
    describe('tests for get', function() {
        it('should respond 200 for "occurrence"', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/occurrences', { 
                'qs': {"taxonname":"consectetur aute eiusmod","taxonid":11730,"siteid":27749,"sitename":"voluptate ipsum consectetur dolor","datasettype":"Metabarcoding aeDNA","altmin":874,"altmax":7741,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","ageof":20022317,"ageyoung":12108542,"ageold":22873971,"limit":9621,"offset":19741895},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});