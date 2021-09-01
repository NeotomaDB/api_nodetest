let apicache = require('apicache');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let express = require('express');
let morgan = require('morgan');
let rfs = require('rotating-file-stream') // version 2.x
let path = require('path');
let YAML = require('yamljs');
let swaggerUi = require('swagger-ui-express');

const dotenv = require('dotenv');
dotenv.config();

let app = express();
let cache = apicache.middleware;

app.engine('html', require('ejs').renderFile);
app.use(cors());
app.use(cache('15 minutes'));
app.use(express.static('mochawesome-report'));

// test trigger watch restart - 09/12/20
//
// create a write stream (in append mode)

const pad = num => (num > 9 ? '' : '0') + num;
const generator = (time, index) => {
  if (!time) return 'access.log';

  var month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());

  return `${month}/${month}${day}-${hour}${minute}-${index}-access.log`;
};

var accessLogStream = rfs.createStream(generator,
  { interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs'),
    compress: true });

// setup the logger
app.enable('trust proxy');
app.use(morgan(':date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length]\t:response-time[0]\t:user-agent', { stream: accessLogStream }))

var options = {
  swaggerUrl: 'http://localhost:3005/api-docs',
  customCssUrl: '/custom.css'
}

let swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Locations for v1.5 files:
var v15index = require('./v1.5/routes/index'); // default route
var v15data = require('./v1.5/routes/data'); // data API routes
var v15apps = require('./v1.5/routes/apps'); // apps API routes
var v15dbtables = require('./v1.5/routes/dbtables'); // dbtables API routes

// Locations for v2.0 files
var v2index = require('./v2.0/routes/index');
var v2data = require('./v2.0/routes/data');
var v2apps = require('./v2.0/routes/apps');
var v2dbtables = require('./v2.0/routes/dbtables');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// optionally, re-factor route paths here to strip version string and
// identify version from header; still requires version directory paths in
// hierarchy of <version>/handlers; <version>/routes; <version>/helpers;
console.log('applying routes...')

app.get('/v1', (req, res) => {
  res.status(301).redirect('http://wnapi.neotomadb.org/')
})

app.get('/v1/doc/*', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/v1/*', (req, res) => {
  res.status(301).redirect('http://wnapi.neotomadb.org' + req.originalUrl)
})

app.get('/tests/*', (req, res) => {
  express.static(path.join(`${__dirname}/mochawesome-report/mochawesome.html`))
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
