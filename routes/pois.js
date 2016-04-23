var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoPois");

/**
 * Método para obtener todos pois
 */
router.get('/', function(req,res){
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
 * Método para añadir un poi
 */
router.post('/', function(req,res){
    var db = new mongoOp();
    var response = {};

    //DATOS COLECCION
    db.user = req.body.user;
    db.nombre = req.body.nombre;
    if( req.body.descripcion != undefined){
        db.descripcion = req.body.descripcion;
    }
    if(req.body.url !== undefined) {
        db.url = req.body.url;
    }
    if(req.body.palabrasClave != undefined) {
        db.palabrasClave = req.body.palabrasClave;
    }
    db.coordX = req.body.coordX;
    db.coordY = req.body.coordY;

    db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        if(err) {
            response = {"error" : true,"message" : "Error adding data"};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response);
    });
});

router.get('/:id', function(req,res){
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
 * Método para actualizar los dato que son actualizables de un poi
 */
router.put('/:id', function(req,res){
    var response = {};
    // first find out record exists or not
    // if it does then update the record
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
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
            if(req.body.coordX !== undefined) {
                // case where password needs to be updated
                data.coordX = req.body.coordX;
            }
            if(req.body.coordY !== undefined) {
                // case where password needs to be updated
                data.coordY = req.body.coordY;
            }
            // save the data
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                }
                res.json(response);
            })
        }
    });
});

/**
 * Metodo para votar
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
                data.valoracion = data.valoracion + req.body.valoracion;
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
 * Método para eliminar un poi
 */
router.delete('/:id', function(req,res){
    var response = {};
    // find the data
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            // data exists, remove it.
            mongoOp.remove({_id : req.params.id},function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error deleting data"};
                } else {
                    response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                }
                res.json(response);
            });
        }
    });
}) ;

module.exports = router;
