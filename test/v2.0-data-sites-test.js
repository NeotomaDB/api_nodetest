'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/sites', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of sites."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/sites', { 
                'qs': {"sitename":"eu","database":"Neotoma Biomarker Database","datasettype":"testate amoebae surface sample","altmin":-467,"altmax":1718,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":13403,"datasetid":89022287,"doi":"10L11537/1NZI:","gpid":5392,"keyword":"bottom","contactid":5932,"taxa":"sunt amet ea deserunt","ageyoung":4508255,"ageold":8909615,"ageof":13214577,"limit":2090,"offset":69141269},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});