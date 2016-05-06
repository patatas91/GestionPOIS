var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoRuta");

/**
 * Petición que devuelve todas las rutas
 */
router.get('/', function(req, res) {
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
 * Petición que permite añadir una ruta.
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
 * Petición que devuelve la ruta correspondiente al 'id'
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
 * Petición que permite modificar la ruta correspondiente al 'id'.
 */
router.put('/:id', function(req,res){
    var response = {};

    //Se busca
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            //Se edita
            if(req.body.pois !== undefined) {
                data.pois = req.body.pois;
            }
            //Se guarda
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
})

/**
 * Petición que permite añadir una recomendación a la ruta correspondiente al 'id'.
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
                    response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                }
                res.json(response);
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
                    response = {"error" : false,"message" : "Data associated with "+req.params.id+"is deleted"};
                }
                res.json(response);
            });
        }
    });
})

module.exports = router;
