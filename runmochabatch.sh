#!/bin/bash

mocha --config=test/.mocharc.yml --reporter-options reportDir=public,reportFilename=tests
