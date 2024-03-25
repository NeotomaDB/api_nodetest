#!/bin/bash
for file in ./test/*.js; do
    echo "$file"
    echo "************************"
    mocha --exit $file
done
