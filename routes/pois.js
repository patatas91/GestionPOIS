var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoPois");
var middleware = require('../middleware');

/**
 * Petición para obtener todos pois
 */
router.get('/', function(req,res){
    var response = {};
    mongoOp.find({},function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/**
 * Petición para añadir un poi
 */
router.post('/', function(req,res){
    var db = new mongoOp();
    var response = {};

    //DATOS obligatorios
    db.user = req.body.user;
    db.nombre = req.body.nombre;
    db.fecha = new Date();
    db.latitud = req.body.latitud;
    db.longitud = req.body.longitud;
    //DATOS opcionales
    if( req.body.descripcion != undefined){
        db.descripcion = req.body.descripcion;
    }
    if(req.body.url !== undefined) {
        db.url = req.body.url;
    }
    if(req.body.palabrasClave != undefined) {
        db.palabrasClave = req.body.palabrasClave;
    }

    db.save(function(err){
        if(err) {
            response = {"error" : true,"message" : "Error adding data"};
            res.json(response);
        } else {
            mongoOp.find({ "user": req.body.user }, function(err, data) {
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
    mongoOp.find( { "user": req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

router.get('/lista/:id', function(req,res){
    var response = {};
    mongoOp.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/**
 * Petición para actualizar los datos que son actualizables de un poi
 */
router.put('/:id', middleware.ensureAuthenticatedAll, function(req,res){
    var response = {};
    //Se busca
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            if(data.user == req.body.userId){
                if(req.body.nombre !== undefined) {
                    // case where password needs to be updated
                    data.nombre = req.body.nombre;
                }
                if(req.body.descripcion !== undefined) {
                    // case where password needs to be updated
                    data.descripcion = req.body.descripcion;
                }
                if(req.body.url !== undefined) {
                    // case where password needs to be updated
                    data.url = req.body.url;
                }
                if(req.body.palabrasClave !== undefined) {
                    // case where password needs to be updated
                    data.palabrasClave = req.body.palabrasClave;
                }
                if(req.body.latitud !== undefined) {
                    // case where password needs to be updated
                    data.latitud = req.body.latitud;
                }
                if(req.body.longitud !== undefined) {
                    // case where password needs to be updated
                    data.longitud = req.body.longitud;
                }
                //Se guarda
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                        res.json(response);
                    } else {
                        mongoOp.find({ "user": req.body.userId }, function(err, data) {
                            if(err) {
                                response = {"error" : true,"message" : "Error updating data"};
                            } else {
                                response = {"error" : false,"message" : data};
                            }
                            res.json(response);
                        });
                    }
                })
            } else{
                response = {"error" : true,"message" : "Error editing data, dont is your POI"};
                res.json(response);
            }

        }
    });
});

/**
 * Petición para votar un determinado poi
 */
router.put('/:id/votar', function(req,res){
    console.log(req.body.valoracion);
    var response = {};
    // first find out record exists or not
    // if it does then update the record
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
            res.json(response);
        } else {
            if(req.body.valoracion !== undefined && req.body.valoracion >= 0 && req.body.valoracion <= 5) {
                // case where password needs to be updated
                data.numVotantes = data.numVotantes + 1;
                data.valoracion = data.valoracion + Number(req.body.valoracion);
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                });
            } else{
                response = {"error" : true,"message" : "Valoración should be in the range 0-5"};
                res.json(response);
            }
        }
    });
});

/**
 * Petición para eliminar un poi, correspondiente al id
 */
router.delete('/:id', middleware.ensureAuthenticatedAll, function(req,res){
    var response = {};
    //Se busca el dato
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            //Si existe y es suyo, se elimina
            if(data.user == req.body.userId){
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                        res.json(response);
                    } else {
                        mongoOp.find({"user": req.body.userId}, function(err, data) {
                            if(err) {
                                response = {"error" : true,"message" : "Error deleting data"};
                            } else {
                                response = {"error" : false,"message" : data};
                            }
                            res.json(response);
                        });
                    }
                });
            } else{
                response = {"error" : true,"message" : "Error deleting data, dont is your POI"};
                res.json(response);
            }

        }
    });
}) ;

/**
  * Función que devuelve los pois filtrados por busqueda
  */
    router.get('/busqueda/:word', function(req,res){
            var response = {};
            mongoOp.find({$or:[{descripcion:{$regex : ".*"+req.params.word+".*"}},{nombre:{$regex : ".*"+req.params.word+".*"}}]} ,function(err,data){
                    if(err) {
                            response = {"error" : true,"message" : "Error fetching data"};
                        } else {
                            response = {"error" : false,"message" : data};
                       }
                   res.json(response);
                });
        });
module.exports = router;
