/**
 * Created by diego on 15/04/2016.
 */
var mongoose = require("mongoose");

// create instance of Schema
var Schema = mongoose.Schema;

/* Esquema correspondiente a las rutas */
var rutaSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'userSchema' },
    "pois": [{ type: Schema.Types.ObjectId, ref: 'poiSchema' }],
    "recomendaciones": { type: Number, default: 0 }
});

// create model if not exists.
module.exports = mongoose.model('Rutas',rutaSchema,'rutas');
