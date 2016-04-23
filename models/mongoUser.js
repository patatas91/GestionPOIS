var mongoose = require("mongoose");
// create instance of Schema
var Schema = mongoose.Schema;
// create schema

/* Esquema correspondiente a los usuarios */
var userSchema = new Schema({
    "tipoUser": Number,
    "email": String,
    "pass": String,
    "nombre": String,
    "apellidos": String,
    "fechaAlta": Date,
    "fechaAcceso": Date
});

// create model if not exists.user
module.exports = mongoose.model('Users',userSchema, 'users');

