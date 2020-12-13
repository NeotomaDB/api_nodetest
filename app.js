var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const YAML = require('yamljs');
var swaggerUi = require('swagger-ui-express'),
swaggerDocument = YAML.load('./swagger.yaml');
var morgan = require('morgan');
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

var app = express();

app.use(cors());
//test trigger watch restart - 09/12/20
//
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan(':date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length]\t:response-time[0]\t:user-agent', { stream: accessLogStream }))

var options = {
  swaggerUrl: 'http://localhost:3005/api-docs',
  customCssUrl: '/custom.css'
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Locations of files:
var v15index = require('./v1.5/routes/index');       // default route
var v15data = require('./v1.5/routes/data');         // data API routes
var v15apps = require('./v1.5/routes/apps');         // apps API routes
var v15dbtables = require('./v1.5/routes/dbtables'); // dbtables API routes

// v2 routes
var v2index = require('./v2.0/routes/index');

// data API routes
var v2data = require('./v2.0/routes/data');

// apps API routes
var v2apps = require('./v2.0/routes/apps');

// dbtables API routes
var v2dbtables = require('./v2.0/routes/dbtables');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// optionally, re-factor route paths here to strip version string and
// identify version from header; still requires version directory paths in
// hierarchy of <version>/handlers; <version>/routes; <version>/helpers;
console.log("applying routes...")

app.get('/v1', (req, res) => {
  res.status(301).redirect('http://wnapi.neotomadb.org/')
})

app.get('/v1/doc/*', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/v1/*', (req, res) => {
  res.status(301).redirect('http://wnapi.neotomadb.org' + req.originalUrl)
})

// use the v1.5 endpoints:
app.use('/', v15index);
app.use('/v1.5/apps', v15apps);
app.use('/v1.5/data', v15data);
app.use('/v1.5/dbtables', v15dbtables);

// Use the v2 endpoints:
app.use('/v2.0/', v2index);
app.use('/v2.0/apps', v2apps);
app.use('/v2.0/data', v2data);
app.use('/v2.0/dbtables', v2dbtables);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.all('*', function (req, res) {
  res.redirect('/api-docs');
});


module.exports = app;
