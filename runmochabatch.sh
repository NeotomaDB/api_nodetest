#!/bin/bash
show_help() {
cat <<HELP
Usage: bash runmochabatch.sh [-hdp]

This is intended to be used with the genoatts.sh bash script to assist with testing the API on local and remote servers.

This bash script uses Mocha (and associated packages) to run tests against the API.

Options:
    [none]      run Mocha tests locally and build the reporter in ./public/tests.html
    -h          display this help and exit
    -d          run the tests against the remove development server at api-dev.neotomadb.org
    -p          run the tests against the remove production server at api.neotomadb.org

HELP
}

run_mocha() {
    # Only run v2.0 tests locally 'v2.0-*.js' — v1.5 endpoints are slow and trip chakram's default timeout
    find ./test -name '*.js' | shuf | xargs mocha --config=test/.mocharc.yml --reporter-options reportDir=public,reportFilename=tests
}

 OPTIND=1
 # Resetting OPTIND is necessary if getopts was used previously in the script.
 # It is a good idea to make OPTIND local if you process options in a function.
 
test=0

# Default target: local production-mode API. Flags below override.
# Must be set BEFORE getopts because getopts skips its loop when no flags are passed.
export APIPATH='http://localhost:3001/'

 while getopts "hdpa" opt; do
     case $opt in
         h)
             show_help
             exit 0
             ;;
         d)
             export APIPATH='https://api-dev.neotomadb.org/'
             ;;
         p)
             export APIPATH='https://api.neotomadb.org/'
             ;;
         a)
             export APIPATH='http://neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com/'
             ;;
         *)
             show_help
             exit 1
             ;;
     esac
 done

run_mocha

shift "$((OPTIND-1))"   # Discard the options and sentinel --
