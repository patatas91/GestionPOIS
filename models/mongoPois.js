/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

// create instance of Schema
var mongoSchema = mongoose.Schema;
var Users = mongoose.model('Users', userSchema);
/* Esquema correspondiente a los usuarios */
var poiSchema = {
    "user": { type: Schema.ObjectId, ref: "Users"},
    "nombre": String,
    "descripcion": String,
    "url": String,
    "palabrasClave": [String],
    "coordX": Number,
    "coordY": Number,
    "numVotantes": Number,
    "valoracion": Number
};

// create model if not exists.
module.exports = mongoose.model('Pois',poiSchema,'pois');
