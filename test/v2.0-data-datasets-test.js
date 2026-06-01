'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets', { 
                'qs': {"sitename":"deserunt adipisicing dolor","database":"North American Plant Macrofossil Database","datasettype":"pollen","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":43025,"datasetid":79833344,"doi":"10R539404963/F6","gpid":5392,"keyword":"beyond radiocarbon","contactid":14609,"taxa":"enim mollit nulla cillum","ageyoung": 1000,"ageold": 10000,"ageof":22916022,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});