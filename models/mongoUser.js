var mongoose = require("mongoose");
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema

/* Esquema correspondiente a las tareas */
var userSchema = {
    "tipoUser": Number,
    "email": String,
    "pass": String,
    "nombre": String,
    "apellidos": String,
    "fechaAlta": Date,
    "fechaAcceso": Date
};

// create model if not exists.user
module.exports = mongoose.model('Users',userSchema, 'users');

