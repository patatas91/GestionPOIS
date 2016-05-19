/**
 * Created by diego on 13/05/2016.
 */
/**
 * Petición que devuelve el usuario correspondiente al 'id'
 */
var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoUser");
var middleware = require("../middleware");

router.get('/', middleware.ensureAuthenticatedAll, function(req,res){
    var response = {};
    mongoOp.findById( req.body.userId ,{"tipoUser": 0, "pass": 0},function(err,data){
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
});

module.exports = router;