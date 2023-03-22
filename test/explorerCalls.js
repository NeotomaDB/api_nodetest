var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

const dotenv = require('dotenv');
dotenv.config();

if (typeof process.env.APIPATH === 'undefined') {
  var testroute = 'http://localhost:' + process.env.APIPORT + '/'
} else {
  testroute = process.env.APIPATH
}

let appServicesLocation = testroute + 'v1.5/apps';

// let appServicesLocation = 'http://localhost:' + process.env.APIPORT + '/v1.5/apps';

describe('Tests for Explorer App Services', function () {
  this.timeout(12000);
  describe('tests for get', function () {
    it('should respond 200 for TaxaGroupTypes', function () {
      var response = request('get', appServicesLocation + '/TaxaGroupTypes', {
        'time': true
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaphonomyTypes', function () {
      var response = request('get', appServicesLocation + '/TaphonomyTypes', {
        'qs': {
          taphonomicSystemId: 1
        },
        'time': true
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaphonomySystems', function () {
      var response = request('get', appServicesLocation + '/TaphonomySystems', {
        'qs': {
          datasetTypeId: 1
        },
        'time': true
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for ElementTypes', function () {
      var response = request('get', appServicesLocation + '/ElementTypes', {
        'qs': {
          taxagroupid: 1
        },
        'time': true
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaxaInDatasets (a slow service)', function () {
      var response = request('get', appServicesLocation + '/TaxaInDatasets', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for collectionTypes', function () {
      var response = request('get', appServicesLocation + '/collectionTypes', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for keywords', function () {
      var response = request('get', appServicesLocation + '/keywords', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for authorpis', function () {
      var response = request('get', appServicesLocation + '/authorpis', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for DepositionalEnvironments', function () {
      var response = request('get', appServicesLocation + '/DepositionalEnvironments', {
        'qs': { idProperty: 1 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for Search', function () {
      var response = request('get', appServicesLocation + '/Search', {
        'qs': { search: '{"taxa":null,"time":null,"space":null,"metadata":null,"datasetTypeId":"21"}',
          'time': true }
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for DatasetTypes', function () {
      var response = request('get', appServicesLocation + '/DatasetTypes', {
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for RelativeAges', function () {
      var response = request('get', appServicesLocation + '/RelativeAges', {
        'qs': { agescaleid: 1 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for Geochronologies', function () {
      var response = request('get', appServicesLocation + '/Geochronologies', {
        'qs': { datasetId: 1001 },
        'time': true
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
