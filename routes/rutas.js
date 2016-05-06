var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoRuta");

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

    db.user = req.body.user;
    db.pois = req.body.pois;

    db.save(function (err) {
        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            response = {"error": false, "message": "Data added"};
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
router.put('/:id', function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            if(req.body.pois !== undefined) {
                data.pois = req.body.pois;
            }
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
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
            })
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
                    mongoOp.find({}, function(err, data) {
                        if(err) {
                            response = {"error" : true,"message" : "Error adding data"};
                        } else {
                            response = {"error" : false,"message" : data};
                        }
                        res.json(response);
                    });
                }
            })
        }
    });
})

/**
 * Función que permite eliminar la ruta que corresponde con el 'id'
 */
router.delete('/:id', function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
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
        }
    });
})

module.exports = router;
