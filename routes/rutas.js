var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoRuta");
var middleware = require('../middleware');

/**
 * Funcion que devuelve las rutas
 */
router.get('/', function(req, res) {
    var response = {};
    mongoOp.find({},function(err,data){
// Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/**
 * Función que permite añadir una ruta
 */
router.post('/', function(req,res) {
    var db = new mongoOp();
    var response = {};
    db.nombre = req.body.nombre;
    db.user = req.body.user;
    db.descripcion = req.body.descripcion;
    db.pois = req.body.pois;
    db.fecha = new Date();

    db.save(function (err) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
            res.json(response);
        } else {
            mongoOp.find({"user": req.body.user}, function(err, data) {
                if(err) {
                    response = {"error" : true,"message" : "Error adding data"};
                } else {
                    response = {"error" : false,"message" : data};
                }
                res.json(response);
            });
        }
    });
});

/**
 * Función que devuelve las rutas correspondientes a un usuario
 */
router.get('/me', middleware.ensureAuthenticatedUser, function(req,res){
    var response = {};
    mongoOp.find( { "user":req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/**
 * Función que devuelve la ruta correspondiente al 'id'
 */
router.get('/:id', function(req,res){
    var response = {};
    mongoOp.findById( req.params.id ,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/**
 * Función que permite modificar la ruta correspondiente al 'id'.
 */
router.put('/:id', middleware.ensureAuthenticatedAll, function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            if(data.user == req.body.userId){ //Si es su ruta la edita
                if(req.body.pois !== undefined) {
                    data.pois = req.body.pois;
                } if(req.body.nombre !== undefined) {
                    data.nombre = req.body.nombre;
                }if(req.body.descripcion !== undefined) {
                    data.descripcion = req.body.descripcion;
                }
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        mongoOp.find({ "user": req.body.userId }, function(err, data) {
                            if(err) {
                                response = {"error" : true,"message" : "Error adding data"};
                            } else {
                                response = {"error" : false,"message" : data};
                            }
                            res.json(response);
                        });
                    }
                });
            } else{ //Si no es una ruta suya no la puede editar
                response = {"error" : true,"message" : "Error editing data, dont is your POI"};
                res.json(response);
            }
        }
    });
})

/**
 * Función que permite añade una recomendación a la ruta correspondiente al 'id'.
 */
router.put('/:id/recomendar', function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            data.recomendaciones = data.recomendaciones + 1;
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : data};
                }
                res.json(response);
            })
        }
    });
})

/**
 * Función que permite eliminar la ruta que corresponde con el 'id'
 */
router.delete('/:id', middleware.ensureAuthenticatedAll, function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            if(data.user == req.body.userId){
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        mongoOp.find({}, function(err, data) {
                            if(err) {
                                response = {"error" : true,"message" : "Error adding data"};
                            } else {
                                response = {"error" : false,"message" : data};
                            }
                            res.json(response);
                        });
                    }
                });
            } else{

            }

        }
    });
})

module.exports = router;
