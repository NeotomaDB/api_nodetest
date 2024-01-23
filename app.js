'use strict';

const apicache = require('apicache');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream'); // version 2.x
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const dbtest = require('./database/pgp_db').dbheader;
const rateLimiter = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const cacheSuccesses = cache('5 minutes', onlyStatus200);

const limiter = rateLimiter({
  max: 50,
  windowMS: 10000, // 1 second
  message: 'You can\'t make any more requests at the moment. Try again later',
  statusCode: 429,
  skip: (req, res) => !!process.env.LOCALLIMIT,
  validate: {trustProxy: false},
});

app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(limiter);
app.use(express.json());
// app.use(cache('5 minutes'));
app.use(express.static('mochawesome-report'));
app.use(compression());

app.locals.db = dbtest();

// test trigger watch restart - 09/12/20
//
// create a write stream (in append mode)

const pad = (num) => (num > 9 ? '' : '0') + num;
const generator = (time, index) => {
  if (!time) return 'access.log';

  const month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());

  return `${month}/${month}${day}-${hour}${minute}-${index}-access.log`;
};

const accessLogStream = rfs.createStream(generator, {
  interval: '1d', // rotate daily
  //    path: path.join(__dirname, 'logs'),
  compress: true,
});

// setup the logger
app.enable('trust proxy');
app.use(morgan(':date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length]\t:response-time[0]\t:user-agent', {
  stream: accessLogStream,
}));

const options = {
  swaggerUrl: 'http://localhost:3005/api-docs',
  customCssUrl: '/custom.css',
};

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Locations for v1.5 files:
const v15index = require('./v1.5/routes/index'); // default route
const v15data = require('./v1.5/routes/data'); // data API routes
const v15apps = require('./v1.5/routes/apps'); // apps API routes
const v15dbtables = require('./v1.5/routes/dbtables'); // dbtables API routes

// Locations for v2.0 files
const v2index = require('./v2.0/routes/index');
const v2data = require('./v2.0/routes/data');
const v2apps = require('./v2.0/routes/apps');
const v2dbtables = require('./v2.0/routes/dbtables');

const healthwatch = require('./v2.0/routes/healthwatch');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// optionally, re-factor route paths here to strip version string and
// identify version from header; still requires version directory paths in
// hierarchy of <version>/handlers; <version>/routes; <version>/helpers;
console.log('applying routes...');

app.get('/v1', (req, res) => {
  res.status(500)
      .json({
        status: 'failure',
        message: 'The v1 instance of the Neotoma API has been decomissioned. If you recieve this message through the neotoma R package, please move to the neotoma2 R package using devtools::install_github("NeotomaDB/neotoma2")',
      });
});

app.get('/v1/doc/*', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/v1/*', (req, res) => {
  res.status(500)
      .json({
        status: 'failure',
        message: 'The v1 instance of the Neotoma API has been decomissioned. If you recieve this message through the neotoma R package, please move to the neotoma2 R package using devtools::install_github("NeotomaDB/neotoma2")',
      });
});

app.get('/tests/*', (req, res) => {
  express.static(path.join(`${__dirname}/mochawesome-report/mochawesome.html`));
});

// For AWS Healthchecks:
app.use('/healthcheck/', healthwatch);

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
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Function error', error: err});
});

app.all('*', function(req, res) {
  res.redirect('/api-docs');
});

// in production, port is 3001 and server started in script 'www'
// The variable is stored in the gitignored `.env` file.
// This is managed in the www folder.
if (process.env.NODE_ENV === 'development') {
  app.listen(3005);
}

module.exports = app;
