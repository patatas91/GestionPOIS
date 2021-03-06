var express = require('express');
var router = express.Router();
var mongoOp = require("../models/mongoUser");
var visitanteOp = require("../models/mongoVisitantes");
var middleware = require("../middleware");
var jwt = require("jsonwebtoken");
var config = require('../config');

/**
 * Petición que devuelve todos los usuarios
 * Petición sólo disponible para el administrador
 */
router.get('/', middleware.ensureAuthenticatedAdmin, function(req, res) {
  var response = {};
  mongoOp.find({"tipoUser": 1, "fechaBaja": {$exists: false}}, {"tipoUser": 0, "pass": 0},function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      response = {"error" : false,"message" : data};
    }
    res.json(response);
  });
});

/**
 * Petición para obtener todos users PRUEBAAAASSSSS
 */
router.get('/visitantes', function(req,res){
  var response = {};
  mongoOp.find({},function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      response = {"error" : false,"message" : data};
    }
    res.json(response);
  });
});

/**
 * Petición que permite añadir un usuario
 * Sólo disponible para el administrador.
 */
router.post('/', middleware.ensureAuthenticatedAdmin, function(req,res) {
  var response = {};
  mongoOp.findOne({"email": req.body.email},function(err,data) {
    if (err) {
      response = {"error": true, "message": "Error adding user"};
      res.json(response);
    } else if(data) { //Si existe ya
      response = {"error": true, "message": "This email is registred."};
      res.json(response);
    } else {
      //Sino se crea
      var db = new mongoOp();
      var password = generar();
      db.tipoUser = 1;
      db.email = req.body.email;
      db.pass = require('crypto')
          .createHash('sha1')
          .update(password)
          .digest('base64');
      db.nombre = req.body.nombre;
      db.apellidos = req.body.apellidos;
      db.fechaAlta = new Date();

      //Se guarda
      db.save(function (err) {
        if (err) {
          console.log(err);
          response = {"error": true, "message": "Error adding user"};
          res.json(response);
        } else {
          mongoOp.find({"tipoUser": 1, "fechaBaja": {$exists: false}}, {"tipoUser": 0, "pass": 0},function(err,data){
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

/*
 * Función que crea la instancia de gestion visitantes
 */
function crearVisit(email, res) {
  mongoOp.findOne({"email": email},function(err,data) {
    var response;
    if (err){
      response = {"error": true, "message": "Error adding user"};
      res.json(response);
    } else{
      var visit = new visitanteOp();
      visit.user = data._id;
      visit.listaFavoritos= [];
      visit.listaSeguidores = [];
      visit.save(function(err){
        if(err){
          response = {"error": true, "message": "Error adding user"};
        } else{
          response = {"error": false, "message": "Se ha añadido correctamente el usuario", "next": "/visitante"};
        }
        res.json(response);
      })
    }
  })
}

/**
 * Petición que permite añadir un visitante.
 */
router.post('/visitante', function(req,res) {
  var response = {};
  mongoOp.findOne({"email": req.body.email},function(err,data) {
    if (err) {
      response = {"error": true, "message": "Error adding user"};
      res.json(response);
    } else if(data) { //Si existe ya
      response = {"error": true, "message": "This email is registred."};
      res.json(response);
    } else {
      //Sino se crea
      var db = new mongoOp();
      var password = req.body.pass;
      db.tipoUser = 2;
      db.email = req.body.email;
      db.pass = require('crypto')
          .createHash('sha1')
          .update(password)
          .digest('base64');
      db.nombre = req.body.nombre;
      db.apellidos = req.body.apellidos;
      db.fechaAlta = new Date();

      //Se guarda
      db.save(function (err) {
        if (err) {
          console.log(err);
          response = {"error": true, "message": "Error adding user"};
          res.json(response);
        } else {
          crearVisit(db.email, res);
        }

      });
    }
  });
});

/**
 * Petición que devuelve el usuario correspondiente al 'id'
 */
router.get('/:id', function(req,res){
  var response = {};
  mongoOp.findById( req.params.id ,{"tipoUser": 0, "pass": 0},function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      response = {"error" : false,"message" : data};
    }
    res.json(response);
  });
});


/**
 * Petición que permite modificar el usuario correspondiente al 'id'.
 */
router.put('/:id', function(req,res){
  var response = {};

  //Se busca el usuario
  mongoOp.findById(req.params.id,function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      //Se actualizan los datos
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

      data.fechaAcceso = new Date();

      //Se guarda
      data.save(function(err){
        if(err) {
          response = {"error" : true,"message" : "Error updating data"};
          res.json(response);
        } else {
          mongoOp.find({"tipoUser": 1, "fechaBaja": {$exists: false}}, {"tipoUser": 0, "pass": 0},function(err,data){
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
 * Petición que permite eliminar el usuario que corresponde con el 'id'
 */
router.delete('/:id', middleware.ensureAuthenticatedAdmin, function(req,res){
  var response = {};

  //Se busca
  mongoOp.findById(req.params.id,function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      //Se indica que se ha dado de baja
      data.fechaBaja = new Date();
      data.save(function(err){
        if(err) {
          response = {"error" : true,"message" : "Error updating data"};
          res.json(response);
        } else {
          //Se devuelven el resto de usuarios
          mongoOp.find({"tipoUser": 1, "fechaBaja": {$exists: false}}, {"tipoUser": 0, "pass": 0},function(err,data){
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

/*
 * Función que genera una contraseña aleatoria de 8 carácteres
 */
function generar() {
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789_/-?¿.:=+";
  var contraseña = "";
  for (i=0; i<8; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

/**
 * Función que permite añadir un visitante
 */
router.post('/registro', function(req,res) {
  var db = new mongoOp();
  var response = {};
  mongoOp.findOne({email: req.body.email},function(err,data) {
    if (err) {
      response = {"error": true, "message": "Error adding user"};
      res.json(response);
    } else if(data) { //Si existe ya

      //Se encripta la contraseña
      var password = require('crypto')
          .createHash('sha1')
          .update(String(req.body.pass))
          .digest('base64');
      //Se comprueba si existe el usuario
      mongoOp.findOne({email: req.body.email, pass: password}, function(err, user) {
        if (err) {
          res.json({
            error: true,
            message: "Error occured."
          });
        } else {
          //Si existe se le asigna un token de acceso y se redirige a su página principal de acuerdo a su rango
          if (user) {
            var token = jwt.sign(user, config.secret, {
              expiresIn: 600 // expires in 24 hours
            });
            var next;
            if(user.tipoUser == 0){
              next = '/admin';
            } else if (user.tipoUser == 1){
              next = '/user';
            } else{
              next = '/acceso';
            }
            //Respuesta con cookie
            res.header(
                {
                  'Set-Cookie': 'token='+token ,
                  'Content-Type': 'text/html'
                }).json({
              error: false,
              next: next,
              message: "Se ha autentificado correctamente"
            });
            res.end();
          } else {
            res.json({
              error: true,
              message: "Incorrect email/password"
            });
          }
        }
      });
    } else {
      //Sino se crea
      var db = new mongoOp();
      db.tipoUser=2;
      db.email = req.body.mail;
      db.pass = require('crypto')
          .createHash('sha1')
          .update(String(req.body.pass))
          .digest('base64');

      //Se guarda
      db.save(function (err) {
        if (err) {
          console.log(err);
          response = {"error": true, "message": "Error adding user"};
          res.json(response);
        } else {
          //Se comprueba si existe el usuario
          mongoOp.findOne({email: req.body.email, pass: password}, function(err, user) {
            if (err) {
              res.json({
                error: true,
                message: "Error occured"
              });
            } else {
              //Si existe se le asigna un token de acceso y se redirige a su página principal de acuerdo a su rango
              if (user) {
                var token = jwt.sign(user, config.secret, {
                  expiresIn: 600 // expires in 24 hours
                });
                var next = '/acceso';
                //Respuesta con cookie
                res.header(
                    {
                      'Set-Cookie': 'token='+token ,
                      'Content-Type': 'text/html'
                    }).json({
                  error: false,
                  next: next,
                  user: user,
                  message: "Se ha autentificado correctamente"
                });
                res.end();
              } else {
                res.json({
                  error: true,
                  message: "Incorrect email/password"
                });
              }
            }
          });
        }
      });
    }
  });
});

/*
 * Función para el arranque del sistema.
 */
router.post('/maestra', function(req,res) {
  var response = {};
      //Sino se crea
      var db = new mongoOp();
      var password = req.body.pass;
      db.tipoUser = 0;
      db.email = req.body.email;
      db.pass = require('crypto')
          .createHash('sha1')
          .update(password)
          .digest('base64');
      db.nombre = req.body.nombre;
      db.apellidos = req.body.apellidos;
      db.fechaAlta = new Date();

      //Se guarda
      db.save(function (err) {
        if (err) {
          console.log(err);
          response = {"error": true, "message": "Error adding user"};
          res.json(response);
        } else {
          response = {"error": false, "message": "Se ha añadido correctamente el usuario"};
        }
        res.json(response);
      });
});

module.exports = router;
