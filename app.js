var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Se importan las diferentes peticiones de la API
var routes = require('./routes/login');
var users = require('./routes/users');
var rutas = require('./routes/rutas');
var pois = require('./routes/pois');
var gestionVisitantes = require('./routes/gestionVisitantes');
var chart = require('./routes/chart');
//Se importan las diferentes peticiones web
var admin = require('./routes/admin');
var user = require('./routes/user');
var visitante=require('./routes/visitante');

var app = express();

//Se especifica la zona horaria de España
process.env.TZ = 'UTC+2';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Se asocian las peticiones con la url
app.use('/', routes);
app.use('/login', routes);
app.use('/users', users);
app.use('/rutas', rutas);
app.use('/pois', pois);
app.use('/gestionVisitantes', gestionVisitantes);

app.use('/admin', admin);
app.use('/chart', chart);

app.use('/user', user);
app.use('/visitante', visitante);

//Petición para devolver cualquier fichero de la carpeta views
app.get('/views/:item', function(req, res) {
    res.sendfile('./views/'+req.params.item); // load the single view file (angular will handle the page changes on the front-end)
});



module.exports = app;
