'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/data/datasets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An array of datasets."', function() {
            var response = request('get', 'http://localhost:3001/v2.0/data/datasets', { 
                'qs': {"sitename":"ea reprehenderit Duis exercitation","database":"FAUNMAP","datasettype":"specimen stable isotope","altmin": 10,"altmax": 100,"loc":"{\"type\":\"Polygon\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}},\"coordinates\":[[[13.4,55.92],[13.5,55.92],[13.5,55.95],[13.4,55.95],[13.4,55.92]]]}","siteid":1671,"datasetid":33225555,"doi":"10F3028263/I","gpid":5392,"keyword":"beyond radiocarbon","contactid":952,"taxa":"occaecat ut elit est et","ageyoung": 1000,"ageold": 10000,"ageof":21061821,"limit": 10,"offset": 0},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});