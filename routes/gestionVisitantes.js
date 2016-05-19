var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoVisitantes");

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
 * Función que permite añade un dato de un visitante
 */
router.post('/', function(req,res) {
    var db = new mongoOp();
    var response = {};

    db.user = req.body.user;

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
 * Función que devuelve el usuario correspondiente al 'id'
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
 * Función que permite modificar el usuario correspondiente al 'id'.
 */
router.put('/:id', function(req,res){
    var response = {};

    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            if(req.body.listaFavoritos !== undefined) {
                data.listaFavoritos = req.body.listaFavoritos;
            }
            if(req.body.listaSeguidores !== undefined) {
                data.listaSeguidores = req.body.listaSeguidores;
            }
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
 * Función que permite eliminar el usuario que corresponde con el 'id'
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
