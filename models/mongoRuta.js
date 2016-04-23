/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

var user = require("./mongoUser");
var poi = require("./mongoPois");

// create instance of Schema
var Schema = mongoose.Schema;
var Users = mongoose.model('Users', 'userSchema');
var Pois = mongoose.model('Pois', 'poisSchema');

/* Esquema correspondiente a los usuarios */
var rutaSchema = {
    "user": { type: Schema.ObjectId, ref: "Users"},
    "pois": [{ type: Schema.ObjectId, ref: "Pois"}],
    "recomendaciones": Number
};

// create model if not exists.
module.exports = mongoose.model('Rutas',rutaSchema,'rutas');
