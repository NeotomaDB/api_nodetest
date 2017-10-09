     var express = require('express');
        var path = require('path');
     var favicon = require('serve-favicon');
      var logger = require('morgan');
var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');

const querystring = require('querystring');

// Locations of files:

//default route
var index = require('./routes/index');
//data API routes
var data = require('./routes/data');
//apps API routes
var apps = require('./routes/apps');
//dbtables API routes
var dbtables = require('./routes/dbtables');

var app = express();


// swagger definition
var swaggerDefinitionJson = require('./swaggerdefn.json');
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinitionJson,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/v2/apps', apps);
app.use('/v2/data', data);
app.use('/v2/dbtables', dbtables);

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.all('*', function(req, res) {
  res.redirect("/api-docs");
});

module.exports = app;