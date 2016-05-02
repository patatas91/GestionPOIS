var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoUser");

/**
 * Funcion que devuelve los usuarios
 */
router.get('/', function(req, res) {
  var response = {};
  mongoOp.find({"tipoUser": 1},function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      response = {"error" : false,"message" : data};
    }
    res.json(response);
  });
});

/**
 * Función que permite añadir un usuario
 */
router.post('/', function(req,res) {
  var response = {};
  mongoOp.findOne({"email": req.body.email},function(err,data) {
    if (err) {
      response = {"error": true, "message": "Error adding user"};
      res.json(response);
    } else if(data) {
      response = {"error": true, "message": "This email is registred."};
      res.json(response);
    } else {
      var db = new mongoOp();
      var password = generar();
      db.tipoUser = req.body.tipoUser;
      db.email = req.body.email;
      db.pass = require('crypto')
          .createHash('sha1')
          .update(password)
          .digest('base64');
      db.nombre = req.body.nombre;
      db.apellidos = req.body.apellidos;
      db.fechaAlta = new Date();

      db.save(function (err) {
        if (err) {
          console.log(err);
          response = {"error": true, "message": "Error adding user"};
          res.json(response);
        } else {
          mongoOp.find({"tipoUser": 1},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
            } else {
              db.pass=password;
              response = {"error": false, "message": data, "user": db};
            }
            res.json(response);
          });

        }
      });
    }
  });
});

/**
 * Función que devuelve el usuario correspondiente al 'id'
 */
router.get('/:id', function(req,res){
  var response = {};
  mongoOp.findById( req.params.id ,function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      response = {"error" : false,"message" : data};
    }
    res.json(response);
  });
});

/**
 * Función que permite modificar el usuario correspondiente al 'id'.
 */
router.put('/:id', function(req,res){
  var response = {};

  mongoOp.findById(req.params.id,function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      if(req.body.email !== undefined) {
        data.email = req.body.email;
      }
      //Si se el mensaje lleva un nombre lo actualiza
      if(req.body.nombre !== undefined) {
        data.nombre = req.body.nombre;
      }
      //Si se el mensaje lleva una contraseña la actualiza
      if(req.body.pass !== undefined) {
        data.pass = require('crypto')
            .createHash('sha1')
            .update(req.body.pass)
            .digest('base64');
      }
      //Si se el mensaje lleva un nombre lo actualiza
      if(req.body.apellidos !== undefined) {
        data.apellidos = req.body.apellidos;
      }
      if(req.body.fechaAcceso !== undefined) {
        data.fechaAcceso = req.body.fechaAcceso;
      }
      data.save(function(err){
        if(err) {
          response = {"error" : true,"message" : "Error updating data"};
          res.json(response);
        } else {
          mongoOp.find({"tipoUser": 1},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
            } else {
              response = {"error": false, "message": data};
            }
            res.json(response);
          });
        }
      })
    }
  });
})

/**
 * Función que permite eliminar el usuario que corresponde con el 'id'
 */
router.delete('/:id', function(req,res){
  var response = {};

  mongoOp.findById(req.params.id,function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      mongoOp.remove({_id : req.params.id},function(err){
        if(err) {
          response = {"error" : true,"message" : "Error deleting data"};
          res.json(response);
        } else {
          mongoOp.find({"tipoUser": 1},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
            } else {
              response = {"error": false, "message": data};
            }
            res.json(response);
          });
        }
      });
    }
  });
})


function generar() {
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789_/-?¿.:=+";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

module.exports = router;
