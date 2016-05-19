/**
 * Created by diego on 06/05/2016.
 */
/**
 * Created by diego on 30/04/2016.
 */
var express = require('express');
var router = express.Router();
var userMongo = require('../models/mongoUser');
var jwt = require("jsonwebtoken");
var config = require('../config');

/* Devuelve la página de acceso. */
router.get('/', function(req, res) {
    res.sendfile('./views/login.html');
});

/**
 * Petición correspondiente que se encarga de comprobar que los campos introducidos por el usuario corresponden con
 * los de un usuario existente.
 */
router.post('/auth', function(req, res) {
    //Se encripta la contraseña
    var password = require('crypto')
        .createHash('sha1')
        .update(req.body.pass)
        .digest('base64');
    //Se comprueba si existe el usuario
    userMongo.findOne({email: req.body.email, pass: password}, function(err, user) {
        if (err) {
            res.json({
                error: true,
                message: "Error occured"
            });
        } else {
            //Si existe se le asigna un token de acceso y se redirige a su página principal de acuerdo a su rango
            if (user) {
                actualizarUltimoAcceso(user);
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 3000 // expires in 24 hours
                });
                var next;
                if(user.tipoUser == 0){
                    next = '/admin';
                } else if (user.tipoUser == 1){
                    next = '/user';
                } else{
                    next = '/acceso';
                }
                //Respuesta con cookie
                res.header(
                    {
                        'Set-Cookie': 'token='+token ,
                        'Content-Type': 'text/html'
                    })
                    .json({
                    error: false,
                    next: next,
                    message: "Se ha autentificado correctamente"
                });
            } else {
                res.json({
                    error: true,
                    message: "Incorrect email/password"
                });
            }
        }
    });
});

/*
 * Actualiza la fecha de último acceso del usuario
 */
function actualizarUltimoAcceso(user){
    user.fechaAcceso = new Date();
    user.save(function(err){
        if(err) {
            console.log('Error acualizando fecha de último acceso');
        }
    })
}

/**
 * Función que permite añadir un visitante
 */
router.post('/registro', function(req, res) {
    //Se comprueba si existe el usuario
    userMongo.findOne({email: req.body.email}, function(err, datos) {
        if (err) {
            res.json({
                error: true,
                message: "Error occured."
            });
        } else if(datos) {
            //Se encripta la contraseña
            var password = require('crypto')
                .createHash('sha1')
                .update(req.body.pass)
                .digest('base64');
            //Si existe se le asigna un token de acceso y se redirige a su página principal de acuerdo a su rango
            userMongo.findOne({email: req.body.email, pass: password}, function(err, user) {
                if(user) {
                    actualizarUltimoAcceso(user);
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 3000 // expires in 24 hours
                    });
                    var next;
                    if (user.tipoUser == 0) {
                        next = '/admin';
                    } else if (user.tipoUser == 1) {
                        next = '/user';
                    } else {
                        next = '/acceso';
                    }
                    //Respuesta con cookie
                    res.header(
                        {
                            'Set-Cookie': 'token=' + token,
                            'Content-Type': 'text/html'
                        })
                        .json({
                            error: false,
                            next: next,
                            message: "Se ha autentificado correctamente"
                        });
                } else {
                    res.json({
                        error: true,
                        message: "Incorrect email/password"
                    });
                }
            });
        } else { //Crear usuario
            var newUser = new userMongo();
            var password = req.body.pass;
            newUser.tipoUser = 2;
            newUser.email = req.body.email;
            newUser.pass = require('crypto')
                .createHash('sha1')
                .update(password)
                .digest('base64');
            //Se guarda
            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                    response = {"error": true, "message": "Error adding user"};
                    res.json(response);
                } else {
                    actualizarUltimoAcceso(newUser);
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 3000 // expires in 24 hours
                    });
                    var next='/acceso';
                    //Respuesta con cookie
                    res.header(
                        {
                            'Set-Cookie': 'token=' + token,
                            'Content-Type': 'text/html'
                        })
                        .json({
                            error: false,
                            next: next,
                            message: "Se ha autentificado correctamente"
                        });
                }
            });
        }
    });
});

module.exports = router;