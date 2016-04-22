/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

// create instance of Schema
var mongoSchema = mongoose.Schema;
var Users = mongoose.model('Users', userSchema);
var Pois = mongoose.model('Pois', poiSchema);
/* Esquema correspondiente a los usuarios */
var rutaSchema = {
    "user": { type: Schema.ObjectId, ref: "Users"},
    "pois": [{ type: Schema.ObjectId, ref: "Pois"}]
};

// create model if not exists.
module.exports = mongoose.model('Rutas',rutaSchema,'rutas');
