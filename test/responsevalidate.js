const chai = require('chai');
const assert = require('assert');
const should = require('chai').should();
const expect = chai.expect;
const supertest = require('supertest');
const path = require('path');
const axios = require('axios');
const YAML = require('yamljs');

const dotenv = require('dotenv');
dotenv.config();

const api = supertest('http://localhost:' + process.env.APIPORT + '/');

const fullPath = path.join(process.cwd(), 'swagger.yaml');
const apidoc = YAML.load(fullPath)

// Import this plugin
const chaiResponseValidator = require('chai-openapi-response-validator');

// Load an OpenAPI file (YAML or JSON) into this plugin
chai.use(chaiResponseValidator(fullPath));

const paths = Object.keys(apidoc.paths);
var apipath = ''
var description = ''

function runTest (description, apipath) {
  describe(description, () => {
    it('should satisfy OpenAPI spec', async () => {
      // Get an HTTP response from your server (e.g. using axios)
      const res = await axios.get('http://localhost:3005' + apipath)
      expect(res.status).to.equal(200);
      expect(res).to.satisfyApiSpec;
    });
  })
}

for (let step = 0; step < paths.length; step++) {
  apipath = paths[step];
  description = 'GET ' + apipath

  runTest(description, apipath.replace(/{.*}/, 1));
}
