const mocha = require('mocha');
const chakram = require('chakram');
const request = chakram.request;
const expect = chakram.expect;

const dotenv = require('dotenv');
dotenv.config();

if (typeof process.env.APIPATH === 'undefined') {
  var testroute = 'http://localhost:' + process.env.APIPORT + '/';
} else {
  testroute = process.env.APIPATH;
}

const appServicesLocation = testroute + 'v1.5/apps';

// let appServicesLocation = 'http://localhost:' + process.env.APIPORT + '/v1.5/apps';

describe('Tests for Explorer App Services', function() {
  this.timeout(12000);
  describe('tests for get', function() {
    it('should respond 200 for TaxaGroupTypes', function() {
      const response = request('get', appServicesLocation + '/TaxaGroupTypes', {
        'time': true,
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaphonomyTypes', function() {
      const response = request('get', appServicesLocation + '/TaphonomyTypes', {
        'qs': {
          taphonomicSystemId: 1,
        },
        'time': true,
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaphonomySystems', function() {
      const response = request('get', appServicesLocation + '/TaphonomySystems', {
        'qs': {
          datasetTypeId: 1,
        },
        'time': true,
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for ElementTypes', function() {
      const response = request('get', appServicesLocation + '/ElementTypes', {
        'qs': {
          taxagroupid: 1,
        },
        'time': true,
      });
      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for TaxaInDatasets (a slow service)', function() {
      const response = request('get', appServicesLocation + '/TaxaInDatasets', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for collectionTypes', function() {
      const response = request('get', appServicesLocation + '/collectionTypes', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for keywords', function() {
      const response = request('get', appServicesLocation + '/keywords', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for authorpis', function() {
      const response = request('get', appServicesLocation + '/authorpis', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });

    it('should respond 200 for DepositionalEnvironments', function() {
      const response = request('get', appServicesLocation + '/DepositionalEnvironments', {
        'qs': {idProperty: 1},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for Search', function() {
      const response = request('post', appServicesLocation + '/Search', {
        'qs': {'search': '{"datasetTypeId":21}',
          'time': true},
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for DatasetTypes', function() {
      const response = request('get', appServicesLocation + '/DatasetTypes', {
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for RelativeAges', function() {
      const response = request('get', appServicesLocation + '/RelativeAges', {
        'qs': {agescaleid: 1},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
    it('should respond 200 for Geochronologies', function() {
      const response = request('get', appServicesLocation + '/Geochronologies', {
        'qs': {datasetId: 1001},
        'time': true,
      });

      expect(response).to.have.status(200);
      return chakram.wait();
    });
  });
});
