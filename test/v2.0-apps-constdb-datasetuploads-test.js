'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /v2.0/apps/constdb/datasetuploads', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Returns an ordered array (from earliest to latest) of upload counts by month (YYYY/MM/DD; all days as 01). Months with no uploads are excluded. "', function() {
            var response = request('get', 'http://localhost:3001/v2.0/apps/constdb/datasetuploads', { 
                'qs': {"dbid":34},
                'time': true
            });

            expect(response).to.have.status(200);
            return chakram.wait();
        });
    
    });
});