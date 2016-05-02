var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var rutas = require('./routes/rutas');
var pois = require('./routes/pois');
var gestionVisitantes = require('./routes/gestionVisitantes');
var chart = require('./routes/chart');

var admin = require('./routes/admin');

var app = express();

process.env.TZ = 'UTC+2';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);
app.use('/rutas', rutas);
app.use('/pois', pois);
app.use('/gestionVisitantes', gestionVisitantes);

app.use('/admin', admin);
app.use('/chart', chart);

app.get('/views/:item', function(req, res) {
    res.sendfile('./views/'+req.params.item); // load the single view file (angular will handle the page changes on the front-end)
});



module.exports = app;
