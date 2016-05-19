var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoVisitantes");
var middleware = require("../middleware");

router.get('/', function(req, res) {
    var response = {};
    mongoOp.find({}, function(err,data){
// Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

/* Devuelve la gestion del visitante que esta logueado */
router.get('/me', middleware.ensureAuthenticatedVisitante, function(req, res) {
    var response = {};
    mongoOp.findOne({ "user": req.body.userId }, function(err,data){
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
    db.listaFavoritos = [];
    db.listaSeguidores = [];

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
 * Función que permite añadir un favorito.
 */
router.put('/fav/:id', middleware.ensureAuthenticatedVisitante, function(req,res){
    var response = {};
    mongoOp.findOne({ "user": req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            data.listaFavoritos.push(req.params.id);
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Se ha añadido correctamente."};
                }
                res.json(response);
            })
        }
    });
})

/**
 * Función que permite eliminar un favorito.
 */
router.put('/deletefav/:id', middleware.ensureAuthenticatedVisitante, function(req,res){
    var response = {};
    mongoOp.findOne({ "user": req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            var index = data.listaFavoritos.indexOf(req.params.id);
            if(index > -1){
                data.listaFavoritos.splice(index, 1);
            }
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Se ha añadido correctamente."};
                }
                res.json(response);
            })
        }
    });
})

/**
 * Función que permite añadir un favorito.
 */
router.put('/follow/:id', middleware.ensureAuthenticatedVisitante, function(req,res){
    var response = {};
    mongoOp.findOne({ "user": req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            data.listaSeguidores.push(req.params.id);
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Se ha añadido correctamente."};
                }
                res.json(response);
            })
        }
    });
})

/**
 * Función que permite eliminar un favorito.
 */
router.put('/unfollow/:id', middleware.ensureAuthenticatedVisitante, function(req,res){
    var response = {};
    mongoOp.findOne({ "user": req.body.userId },function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            var index = data.listaSeguidores.indexOf(req.params.id);
            if(index > -1){
                data.listaSeguidores.splice(index, 1);
            }
            data.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error updating data"};
                } else {
                    response = {"error" : false,"message" : "Se ha añadido correctamente."};
                }
                res.json(response);
            })
        }
    });
})

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
