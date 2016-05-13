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
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 7200 // expires in 2h
                });
                //Se actualiza fecha de acceso
                user.fechaAcceso = new Date();
                user.save(function(err){
                    if(err) {
                        Console.log("Error al actualizar fecha de acceso");
                    }
                })
                var next;
                if(user.tipoUser == 0){
                    next = '/admin';
                } else if (user.tipoUser == 1){
                    next = '/user';
                } else{
                    next = '/visitante';
                }
                //Respuesta con cookie
                res.header(
                    {
                    'Set-Cookie': 'token='+token ,
                    'Content-Type': 'text/html'
                }).json({
                    error: false,
                    next: next,
                    message: "Se ha autentificado correctamente"
                });
                res.end();
            } else {
                res.json({
                    error: true,
                    message: "Incorrect email/password"
                });
            }
        }
    });
});

module.exports = router;