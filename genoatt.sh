#!/bin/bash
show_help() {
cat <<HELP
Usage: bash genoatt.sh [-htdp]

Use the oatts npm module to build mocha tests for the package and optionally execute the test suite.

This bash script also performs some text replacement to account for issues in the oatts module:

 * We replace all loc parameters with valid a geoJSON polygon (Colorado).
 * We ensure that all ageyounger dates are more recent than the ageolder.
 * We ensure that all altmin values are lower than altmax values.

Options:
    [none]      build the mocha tests and exit
    -h          display this help and exit
    -t          build the tests and run "npm test"
    -d          build the tests for the remove development server at api-dev.
    -p          build the tests for the remove production server at api.neotomadb.org

HELP
}

run_oatt() {

    rm ./test/v*.js
    oatts generate --host $remote -s ./swagger.yaml -w test
    eslint --quiet --fix ./test > genoatt.log

    # oatts is a bit silly in picking its variables.  We need to make sure that we're
    # getting the proper polygons, and making sure altmin/altmax are appropriate.
    find ./test -type f -exec sed -i -E "s/'loc':\ '\{.*?\}'/'loc': '{\"type\":\"Polygon\",\"coordinates\":[[[-104.053249,41.001406],[-104.675999,41.000957],[-104.855273,40.998048],[-105.277138,40.998173],[-105.730421,40.996886],[-106.217573,40.997734],[-106.453859,41.002057],[-106.857773,41.002663],[-107.625624,41.002124],[-108.250649,41.000114],[-108.884138,41.000094],[-109.050076,41.000659],[-109.048044,40.619231],[-109.050946,40.444368],[-109.050615,39.87497],[-109.051363,39.497674],[-109.051512,39.126095],[-109.054189,38.874984],[-109.059541,38.719888],[-109.060062,38.275489],[-109.041762,38.16469],[-109.041058,37.907236],[-109.041865,37.530726],[-109.04581,37.374993],[-109.045223,36.999084],[-108.620309,36.999287],[-108.249358,36.999015],[-108.000623,37.000001],[-107.420913,37.000005],[-106.877292,37.000139],[-106.869796,36.992426],[-106.201469,36.994122],[-105.62747,36.995679],[-105.1208,36.995428],[-105.000554,36.993264],[-104.338833,36.993535],[-103.733247,36.998016],[-103.002199,37.000104],[-102.814616,37.000783],[-102.698142,36.995149],[-102.04224,36.993083],[-102.041974,37.352613],[-102.041574,37.680436],[-102.044644,38.045532],[-102.045324,38.453647],[-102.045388,38.813392],[-102.048449,39.303138],[-102.050422,39.646048],[-102.051744,40.003078],[-102.051725,40.537839],[-102.051614,41.002377],[-102.556789,41.002219],[-102.865784,41.001988],[-103.497447,41.001635],[-104.053249,41.001406]]]}'/g" {} \;
    find ./test -type f -exec sed -i -E "s/'loc':\ \"\{.*?\}\"/'loc': '{\"type\":\"Polygon\",\"coordinates\":[[[-104.053249,41.001406],[-104.675999,41.000957],[-104.855273,40.998048],[-105.277138,40.998173],[-105.730421,40.996886],[-106.217573,40.997734],[-106.453859,41.002057],[-106.857773,41.002663],[-107.625624,41.002124],[-108.250649,41.000114],[-108.884138,41.000094],[-109.050076,41.000659],[-109.048044,40.619231],[-109.050946,40.444368],[-109.050615,39.87497],[-109.051363,39.497674],[-109.051512,39.126095],[-109.054189,38.874984],[-109.059541,38.719888],[-109.060062,38.275489],[-109.041762,38.16469],[-109.041058,37.907236],[-109.041865,37.530726],[-109.04581,37.374993],[-109.045223,36.999084],[-108.620309,36.999287],[-108.249358,36.999015],[-108.000623,37.000001],[-107.420913,37.000005],[-106.877292,37.000139],[-106.869796,36.992426],[-106.201469,36.994122],[-105.62747,36.995679],[-105.1208,36.995428],[-105.000554,36.993264],[-104.338833,36.993535],[-103.733247,36.998016],[-103.002199,37.000104],[-102.814616,37.000783],[-102.698142,36.995149],[-102.04224,36.993083],[-102.041974,37.352613],[-102.041574,37.680436],[-102.044644,38.045532],[-102.045324,38.453647],[-102.045388,38.813392],[-102.048449,39.303138],[-102.050422,39.646048],[-102.051744,40.003078],[-102.051725,40.537839],[-102.051614,41.002377],[-102.556789,41.002219],[-102.865784,41.001988],[-103.497447,41.001635],[-104.053249,41.001406]]]}'/g" {} \;
    find ./test -type f -exec sed -i -E "s/'altmin':\ -*[0-9]+/'altmin':\ 10/g" {} \;
    find ./test -type f -exec sed -i -E "s/'altmax':\ -*[0-9]+/'altmax':\ 100/g" {} \;
    find ./test -type f -exec sed -i -E "s/'ageold':\ -*[0-9]+/'ageold':\ 10000/g" {} \;
    find ./test -type f -exec sed -i -E "s/'ageyoung':\ -*[0-9]+/'ageyoung':\ 1000/g" {} \;
    find ./test -type f -exec sed -i -E "s/'start':\ -*[0-9]+/'start':\ 1/g" {} \;
    find ./test -type f -exec sed -i -E "s/'end':\ -*[0-9]+/'end':\ 10/g" {} \;
    # Cleaning up the limits & offset:
    find ./test -type f -exec sed -i -E "s/'limit':\ -*[0-9]+/'limit':\ 10/g" {} \;
    find ./test -type f -exec sed -i -E "s/'offset':\ -*[0-9]+/'offset':\ 0/g" {} \;
    find ./test -type f -exec sed -i "s/\/[0-9]\{5,\}/\/500/g" {} \;
}

 OPTIND=1
 # Resetting OPTIND is necessary if getopts was used previously in the script.
 # It is a good idea to make OPTIND local if you process options in a function.
 
test=0
remote=localhost:3001

 while getopts "htdpa" opt; do
     case $opt in
         h)
             show_help
             exit 0
             ;;
         t)
             test=1
             ;;
         d)            
             remote=api-dev.neotomadb.org
             ;;
         p)
             remote=api.neotomadb.org
             ;;
         a)
             remote=neotomaapi-env.eba-wd29jtvf.us-east-2.elasticbeanstalk.com
             ;;
         *)
             echo You didn\'t use the correct flag.
             show_help
             exit 1
             ;;
     esac
 done

run_oatt

if [ $test -eq 1 ]; then
    echo Waiting for API to rebuild before tests \(3s\)
    sleep 3s
    npm test
    exit 0
fi

 shift "$((OPTIND-1))"   # Discard the options and sentinel --
 