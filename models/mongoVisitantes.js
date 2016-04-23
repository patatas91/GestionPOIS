/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

// create instance of Schema
var Schema = mongoose.Schema;

/* Esquema correspondiente a la información de los visitantes */
var visitantesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'userSchema' },
    listaFavoritos: [{ type: Schema.Types.ObjectId, ref: 'poiSchema' }],
    listaSeguidores: [{ type: Schema.ObjectId, ref: "userSchema"}]
});

// create model if not exists.
module.exports = mongoose.model('Visitantes',visitantesSchema,'visitantes');
