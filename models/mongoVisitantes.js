/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

var user = require("./mongoUser");
var poi = require("./mongoPois");

// create instance of Schema
var Schema = mongoose.Schema;
var Users = mongoose.model('Users');
var Pois = mongoose.model('Pois');

/* Esquema correspondiente a los usuarios */
var visitantesSchema = {
    user: { type: Schema.ObjectId, ref: "Users"},
    listaFavoritos: [{ type: Schema.ObjectId, ref: "Pois"}],
    listaSeguidores: [{ type: Schema.ObjectId, ref: "Users"}]
};

// create model if not exists.
module.exports = mongoose.model('Visitantes',visitantesSchema,'visitantes');
