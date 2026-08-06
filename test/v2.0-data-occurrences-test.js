'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/occurrences', function() {
    describe('tests for get', function() {
        it('should respond 200 for "occurrence"', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/occurrences', { 
                'qs': {"taxonname":"magna irure anim consectetur ullamco","taxonid":21012,"siteid":49855,"sitename":"mollit","datasettype":"stable isotope","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","ageof":2647566,"ageyoung": 1000,"ageold": 10000,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});