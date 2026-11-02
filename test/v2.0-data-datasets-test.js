'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets', { 
                'qs': {"sitename":"pariatur nostrud","database":"Holocene Perspective on Peatland Biogeochemistry","datasettype":"macroinvertebrate","altmin":7210,"altmax":3930,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":38575,"datasetid":23058827,"doi":"10&5128/:N","gpid":5392,"keyword":"pre-European","contactid":1496,"taxa":"enim amet","ageyoung":3455524,"ageold":1887101,"ageof":17277151,"limit":9760,"offset":33884502},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});