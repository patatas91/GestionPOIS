/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

// create instance of Schema
var Schema = mongoose.Schema;

/* Esquema correspondiente a los pois */
var poiSchema = new Schema({
    "user": {type: Schema.Types.ObjectId, ref: 'userSchema'},
    "nombre": String,
    "descripcion": String,
    "url": String,
    "palabrasClave": [String],
    "latitud": Number,
    "longitud": Number,
    "numVotantes": {type: Number, default: 0},
    "valoracion": {type: Number, default: 0},
    "fecha": Date
});

// create model if not exists.
module.exports = mongoose.model('Pois',poiSchema,'pois');
