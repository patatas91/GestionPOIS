/**
 * Created by diego on 06/05/2016.
 */
var moment = require('moment');
var config = require('./config');
var jwt = require('jsonwebtoken');

/*
 * Método de autenticación para el administrador
 */
exports.ensureAuthenticatedAdmin = function(req, res, next) {

    var cookies = parseCookies(req);
    var token = cookies.token;
    if(token){
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({error: true, message: "No esta logueado."});
            } else {
                // if everything is good, save to request for use in other routes
                if(decoded._doc.tipoUser == 0){
                    next();
                } else{
                    res.json({error: true, message: "No tienes permiso para acceder ahi."});
                }
            }
        });
    } else{
        res.json({error: true, message: "No esta logueado."});
    }
}

/*
 * Método de autenticación para los usuarios
 */
exports.ensureAuthenticatedUser = function(req, res, next) {

    var cookies = parseCookies(req);
    var token = cookies.token;
    if(token){
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({error: true, message: "No esta logueado."});
            } else {
                // if everything is good, save to request for use in other routes
                if(decoded._doc.tipoUser == 1){
                    next();
                } else{
                    res.json({error: true, message: "No tienes permiso para acceder ahi."});
                }
            }
        });
    }
}

/*
 * Método de autenticación para los visitantes
 */
exports.ensureAuthenticatedVisitante = function(req, res, next) {

    var cookies = parseCookies(req);
    var token = cookies.token;
    if(token){
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({error: true, message: "No esta logueado."});
            } else {
                // if everything is good, save to request for use in other routes
                if(decoded._doc.tipoUser == 2){
                    next();
                } else{
                    res.json({error: true, message: "No tienes permiso para acceder ahi."});
                }
            }
        });
    }
}

/**
 * Función para parsear las cookies y obtenerlas del request
 */
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}