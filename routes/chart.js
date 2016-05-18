var express = require('express');
var router = express.Router();
var mongoUser = require("../models/mongoUser");
var mongoPois = require("../models/mongoPois");
var mongoRuta = require("../models/mongoRuta");
var middleware = require('../middleware');
/**
 * Funciones que devuelven los datos de una gráfica para el formato de Chart.js
 */

/*
 * Función que devuelve los datos para la gráfica de últimos accesos.
 * Sólo puede acceder a estos datos el administrador.
 */
router.get('/ultimosAccesos',function(req, res) {
  //Esqueleto de los datos
  var myChart ={
    type: 'bar',
    data: {
      labels: ["Última semana", "Hace 2 semanas", "Hace 3 semanas", "Hace 4 semanas", "Hace 5 semanas", "Hace 6 semanas"],
      datasets: []
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  }

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
  //Accesos hace 1 semana
  mongoUser.count({"fechaAcceso": {$gt: date1}, "tipoUser":1},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data); //Se añade a la lista
      //Accesos hace 2 semanas
      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
      mongoUser.count({"fechaAcceso": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
        } else {
          datos.push(data);
          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
          //Accesos hace 3 semanas
          mongoUser.count({"fechaAcceso": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
              res.json(response)
            } else {
              datos.push(data);
              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
              //Accesos hace 4 semanas
              mongoUser.count({"fechaAcceso": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
                  res.json(response);
                } else {
                  datos.push(data);
                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                  //Accesos hace 5 semanas
                  mongoUser.count({"fechaAcceso": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
                    if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                      res.json(response);
                    } else {
                      datos.push(data);
                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                      //Accesos hace 6 semanas
                      mongoUser.count({"fechaAcceso": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                        if(err) {
                          response = {"error" : true,"message" : "Error fetching data"};
                          res.json(response);
                        } else {
                          datos.push(data);
                          //Se añaden los datos recogidos al esqueleto definido anteriormente
                          var sets = [{
                            label: 'Nº Usuarios',
                            data: datos,
                            backgroundColor: "#1F775E"
                          }];
                          myChart.data.datasets = sets;
                          response = {"error": false, "message": myChart};
                          res.json(response)
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/*
 * Función que devuelve los datos para la gráfica de números de usuarios que se han dado de alta y baja.
 * Sólo puede acceder a estos datos el administrador.
 */
router.get('/altasYbajas',function(req, res) {
  //Esqueleto de los datos
  var myChart ={
    type: 'bar',
    data: {
      labels: ["Última semana", "Hace 2 semanas", "Hace 3 semanas", "Hace 4 semanas", "Hace 5 semanas", "Hace 6 semanas"],
      datasets: []
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  }

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);
  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
  //Altas desde hace 1 semana
  mongoUser.count({"fechaAlta": {$gt: date1}, "tipoUser":1},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data);
      //Accesos hace 2 semanas
      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
      mongoUser.count({"fechaAlta": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
        } else {
          datos.push(data);
          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
          //Accesos hace 3 semanas
          mongoUser.count({"fechaAlta": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
              res.json(response)
            } else {
              datos.push(data);
              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
              //Accesos hace 4 semanas
              mongoUser.count({"fechaAlta": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
                  res.json(response);
                } else {
                  datos.push(data);
                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                  //Accesos hace 5 semanas
                  mongoUser.count({"fechaAlta": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
                    if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                      res.json(response);
                    } else {
                      datos.push(data);
                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                      //Accesos hace 6 semanas
                      mongoUser.count({"fechaAlta": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                        if(err) {
                          response = {"error" : true,"message" : "Error fetching data"};
                          res.json(response);
                        } else {
                          datos.push(data);
                          var sets = [{
                            label: 'Nº Altas',
                            data: datos,
                            backgroundColor: "#178A25"
                          }];
                          datos = [];
                          date1 = new Date().setHours(0,0,0);
                          date2 = new Date().setHours(0,0,0);
                          //Bajas desde hace 1 semana
                          mongoUser.count({"fechaBaja": {$gt: date1}, "tipoUser":1},function(err,data){
                            if(err){
                              response = {"error" : true,"message" : "Error fetching data"};
                              res.json(response);
                            } else{
                              datos.push(data);
                              //Accesos hace 2 semanas
                              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
                              mongoUser.count({"fechaBaja": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                                if(err) {
                                  response = {"error" : true,"message" : "Error fetching data"};
                                  res.json(response);
                                } else {
                                  datos.push(data);
                                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
                                  //Accesos hace 3 semanas
                                  mongoUser.count({"fechaBaja": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
                                    if(err) {
                                      response = {"error" : true,"message" : "Error fetching data"};
                                      res.json(response)
                                    } else {
                                      datos.push(data);
                                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
                                      //Accesos hace 4 semanas
                                      mongoUser.count({"fechaBaja": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                                        if(err) {
                                          response = {"error" : true,"message" : "Error fetching data"};
                                          res.json(response);
                                        } else {
                                          datos.push(data);
                                          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                                          //Accesos hace 5 semanas
                                          mongoUser.count({"fechaBaja": {$gt: date1, $lt: date2}, "tipoUser":1},function(err,data){
                                            if(err) {
                                              response = {"error" : true,"message" : "Error fetching data"};
                                              res.json(response);
                                            } else {
                                              datos.push(data);
                                              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                                              //Accesos hace 6 semanas
                                              mongoUser.count({"fechaBaja": {$gt: date2, $lt: date1}, "tipoUser":1},function(err,data){
                                                if(err) {
                                                  response = {"error" : true,"message" : "Error fetching data"};
                                                  res.json(response);
                                                } else {
                                                  datos.push(data);
                                                  //Se añaden los datos recogidos al esqueleto definido anteriormente, en este caso son 2 datasets(altas y bajas)
                                                  var set2 = {
                                                    label: 'Nº Bajas',
                                                    data: datos,
                                                    backgroundColor: "#981818"
                                                  };
                                                  sets.push(set2);
                                                  myChart.data.datasets = sets;
                                                  response = {"error": false, "message": myChart};
                                                  res.json(response);
                                                }
                                              });
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/*
 * Función que devuelve los datos para la gráfica de número de pois que se han añadido en las últimas semanas.
 * Sólo puede acceder a estos datos el administrador.
 */
router.get('/pois', function(req, res) {

  //Esqueleto de la gráfica
  var myLineChart = {
    type: 'line',
    data: {},
    options: {}
  };

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
  //Accesos hace 1 semana
  mongoPois.count({"fecha": {$gt: date1}},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data);
      //Accesos hace 2 semanas
      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
      mongoPois.count({"fecha": {$gt: date2, $lt: date1}},function(err,data){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
        } else {
          datos.push(data);
          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
          //Accesos hace 3 semanas
          mongoPois.count({"fecha": {$gt: date1, $lt: date2}},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
              res.json(response)
            } else {
              datos.push(data);
              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
              //Accesos hace 4 semanas
              mongoPois.count({"fecha": {$gt: date2, $lt: date1}},function(err,data){
                if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
                  res.json(response);
                } else {
                  datos.push(data);
                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                  //Accesos hace 5 semanas
                  mongoPois.count({"fecha": {$gt: date1, $lt: date2}},function(err,data){
                    if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                      res.json(response);
                    } else {
                      datos.push(data);
                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                      //Accesos hace 6 semanas
                      mongoPois.count({"fecha": {$gt: date2, $lt: date1}},function(err,data){
                        if(err) {
                          response = {"error" : true,"message" : "Error fetching data"};
                          res.json(response);
                        } else {
                          datos.push(data);
                          //Se añaden los datos recogidos al esqueleto definido anteriormente
                          myLineChart.data = {
                            labels: ["Última semana", "Hace 2 semanas", "Hace 3 semanas", "Hace 4 semanas", "Hace 5 semanas", "Hace 6 semanas"],
                            datasets: [
                              {
                                label: "Nº de POIS añadidos",
                                backgroundColor: "rgba(108,164,232,0.4)",
                                borderColor: "rgba(13,35,62,0.4)",
                                borderWidth: 1,
                                data: datos
                              }
                            ]
                          };
                          response = {"error": false, "message": myLineChart};
                          res.json(response)
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/*
 * Función que devuelve los pois del usuario mejor valorados.
 */
router.get('/bestpois', middleware.ensureAuthenticatedAll, function(req, res) {
  //Esqueleto de la gráfica
  var myChart ={
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  }

  var response = {};
  var nombres = [];
  var valoracion = [];

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  //.sort({"valoracion": -1}).limit(5)
  var lista;
  mongoPois.find(({"user": req.body.userId}),function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      lista = data;
      for(var i = 0; i<lista.length; i++) {
        nombres.push(lista[i].nombre);
        valoracion.push(lista[i].valoracion/lista[i].numVotantes);
      }
      var sets = [{
        label: 'Valoracion del POI',
        data: valoracion,
        backgroundColor: "#1F775E"
      }];
      myChart.data.datasets = sets;
      myChart.data = {
        labels: nombres,
        datasets: sets
      }
      response = {"error" : false, "message": myChart}
    }
    res.json(response);
  }).sort({"valoracion": -1}).limit(5);
});

/*
 * Función que devuelve las rutas del usuario mejor valorados.
 */
router.get('/bestroutes', middleware.ensureAuthenticatedAll, function(req, res) {
  //Esqueleto de la gráfica
  var myChart ={
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  }

  var response = {};
  var nombres = [];
  var recomendaciones = [];

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  var lista;
  mongoRuta.find({"user": req.body.userId},function(err,data){
    if(err) {
      response = {"error" : true,"message" : "Error fetching data"};
    } else {
      lista = data;
      for(var i = 0; i<lista.length; i++) {
        nombres.push(lista[i].nombre);
        recomendaciones.push(lista[i].recomendaciones);
      }
      var sets = [{
        label: 'Numero de recomendaciones',
        data: recomendaciones,
        backgroundColor: "#1F775E"
      }];
      myChart.data.datasets = sets;
      myChart.data = {
        labels: nombres,
        datasets: sets
      }
      response = {"error" : false, "message": myChart}
    }
    res.json(response);
  }).sort({"recomendaciones": -1}).limit(5);
});

/*
 * Función que devuelve los usuarios mas activos.
 */
router.get('/bestusers', function(req, res) {

  var response = {};

  //Se realiza la búsqueda de usuarios
  mongoUser.find({}, function (err, data) {
    if (err) {
      response = {"error": true, "message": "Error fetching data"};
      res.json(response);
    } else {
      poisUser(data, 0, [],res);
    }
  });
});

/**
 * Función recursiva que obtiene el número de pois de cada usuario y almacena los pares de valores
 **/
function poisUser(lista, i, todo,res){
  var response;
  //Condicional recursivo, hasta que acabe la lista
  if( i != lista.length){
    mongoPois.count({"user": lista[i]._id}, function (err, count) {
      if (err) {
        response = {"error": true, "message": "Error fetching data"};
        res.json(response);
      } else {
        todo.push([lista[i].nombre,count]);
        poisUser(lista, i + 1, todo,res);
      }
    });
  } else{  //Si se ha acabado de recorrer la lista, se genera la gráfica y se manda
    //Esqueleto de la gráfica
    var myChart = {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }

    //Se ordena la lista de listas con los pares de valores por el valor cuenta */
    var final = todo;
    final.sort(function(a,b){
      return a[1] > b[1]; // orden ascendente
    });

    var nombres = [];
    var numPois = [];

    /* Se obtienen los 5 últimos datos, los mayores */
    for(var i=0; (i < 5) && (i < final.length); i++){
      var aux = final[final.length-(i+1)];
      nombres.push(aux[0]);
      numPois.push(aux[1]);
    }

    //Se completa la gráfica
    var sets = [{
      label: 'Número de POIS',
      data: numPois,
      backgroundColor: "#1F775E"
    }];
    myChart.data = {
      labels: nombres,
      datasets: sets
    }
    //Se envia
    response = {"error": false, "message": myChart};
    res.json(response);
  }
}

/*
 * Función que devuelve los datos para la gráfica del numero de pois añadidos en las ultimas semanas por el usuario
 */
router.get('/lastpois', middleware.ensureAuthenticatedAll, function(req, res) {

  //Esqueleto de la gráfica
  var myLineChart = {
    type: 'line',
    data: {},
    options: {}
  };

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;

  //Accesos hace 1 semana
  mongoPois.count({"user": req.body.userId, "fecha": {$gt: date1}},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data);
      //Accesos hace 2 semanas
      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
      mongoPois.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
        } else {
          datos.push(data);
          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
          //Accesos hace 3 semanas
          mongoPois.count({"user": req.body.userId, "fecha": {$gt: date1, $lt: date2}},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
              res.json(response)
            } else {
              datos.push(data);
              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
              //Accesos hace 4 semanas
              mongoPois.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
                if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
                  res.json(response);
                } else {
                  datos.push(data);
                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                  //Accesos hace 5 semanas
                  mongoPois.count({"user": req.body.userId, "fecha": {$gt: date1, $lt: date2}},function(err,data){
                    if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                      res.json(response);
                    } else {
                      datos.push(data);
                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                      //Accesos hace 6 semanas
                      mongoPois.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
                        if(err) {
                          response = {"error" : true,"message" : "Error fetching data"};
                          res.json(response);
                        } else {
                          datos.push(data);
                          //Se añaden los datos recogidos al esqueleto definido anteriormente
                          myLineChart.data = {
                            labels: ["Última semana", "Hace 2 semanas", "Hace 3 semanas", "Hace 4 semanas", "Hace 5 semanas", "Hace 6 semanas"],
                            datasets: [
                              {
                                label: "Nº de POIS añadidos",
                                backgroundColor: "rgba(108,164,232,0.4)",
                                borderColor: "rgba(13,35,62,0.4)",
                                borderWidth: 1,
                                data: datos
                              }
                            ]
                          };
                          response = {"error": false, "message": myLineChart};
                          res.json(response)
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

/*
 * Función que devuelve los datos para la gráfica del numero de rutas añadidas en las ultimas semanas por el usuario
 */
router.get('/lastroutes', middleware.ensureAuthenticatedAll, function(req, res) {

  //Esqueleto de la gráfica
  var myLineChart = {
    type: 'line',
    data: {},
    options: {}
  };

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);

  //SE REALIZAN UNA SERIE DE CONSULTAS PARA OBTENER TODOS DATOS QUE HACEN FALTA PARA FORMAR LA GRÁFICA
  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;

  //Accesos hace 1 semana
  mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date1}},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data);
      //Accesos hace 2 semanas
      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 14;
      mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
        if(err) {
          response = {"error" : true,"message" : "Error fetching data"};
          res.json(response);
        } else {
          datos.push(data);
          date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 21;
          //Accesos hace 3 semanas
          mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date1, $lt: date2}},function(err,data){
            if(err) {
              response = {"error" : true,"message" : "Error fetching data"};
              res.json(response)
            } else {
              datos.push(data);
              date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
              //Accesos hace 4 semanas
              mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
                if(err) {
                  response = {"error" : true,"message" : "Error fetching data"};
                  res.json(response);
                } else {
                  datos.push(data);
                  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 35;
                  //Accesos hace 5 semanas
                  mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date1, $lt: date2}},function(err,data){
                    if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                      res.json(response);
                    } else {
                      datos.push(data);
                      date2 = new Date().getTime() - 1000 * 60 * 60 * 24 * 42;
                      //Accesos hace 6 semanas
                      mongoRuta.count({"user": req.body.userId, "fecha": {$gt: date2, $lt: date1}},function(err,data){
                        if(err) {
                          response = {"error" : true,"message" : "Error fetching data"};
                          res.json(response);
                        } else {
                          datos.push(data);
                          //Se añaden los datos recogidos al esqueleto definido anteriormente
                          myLineChart.data = {
                            labels: ["Última semana", "Hace 2 semanas", "Hace 3 semanas", "Hace 4 semanas", "Hace 5 semanas", "Hace 6 semanas"],
                            datasets: [
                              {
                                label: "Nº de rutas añadidas",
                                backgroundColor: "rgba(108,164,232,0.4)",
                                borderColor: "rgba(13,35,62,0.4)",
                                borderWidth: 1,
                                data: datos
                              }
                            ]
                          };
                          response = {"error": false, "message": myLineChart};
                          res.json(response)
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
