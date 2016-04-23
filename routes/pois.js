var express = require('express');
var router = express.Router();
var mongoOp = require("../models/poiSchema");

app.get('/',function(req,res){
    res.json({"error" : false,"message" : "Gestion de POIS"});
});

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

router.post('/', function(req,res){
    var db = new mongoOp();
    var response = {};

    //DATOS COLECCION
    db.user = req.body.user;
    db.nombre = req.body.nombre;
    db.descripcion = req.body.descripcion;
    db.url = req.body.url;
    db.palabrasClave = req.body.palabrasClave ;
    db.coordX = req.body.coordX;
    db.coordY = req.body.coordY;
    db.numVotantes = req.body.numVotantes;
    db.valoracion = req.body.valoracion;

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

router.put('/:id', function(req,res){
    var response = {};
    // first find out record exists or not
    // if it does then update the record
    mongoOp.findById(req.params.id,function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            // we got data from Mongo.
            // change it accordingly.
            if(req.body.user !== undefined) {
                data.user = req.body.user;
            }
            if(req.body.nombre !== nombre) {
                // case where password needs to be updated
                data.nombre = req.body.nombre;
            }
            if(req.body.descripcion !== descripcion) {
                // case where password needs to be updated
                data.descripcion = req.body.descripcion;
            }
            if(req.body.url !== url) {
                // case where password needs to be updated
                data.url = req.body.url;
            }
            if(req.body.palabrasClave !== palabrasClave) {
                // case where password needs to be updated
                data.palabrasClave = req.body.palabrasClave;
            }
            if(req.body.coordX !== coordX) {
                // case where password needs to be updated
                data.coordX = req.body.coordX;
            }
            if(req.body.coordY !== coordY) {
                // case where password needs to be updated
                data.coordY = req.body.coordY;
            }
            if(req.body.numVotantes !== numVotantes) {
                // case where password needs to be updated
                data.numVotantes = req.body.numVotantes;
            }
            if(req.body.valoracion !== valoracion) {
                // case where password needs to be updated
                data.valoracion = req.body.valoracion;
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
