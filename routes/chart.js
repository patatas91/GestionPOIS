var express = require('express');
var router = express.Router();
var mongoUser = require("../models/mongoUser");
var mongoPois = require("../models/mongoPois");

/**
 * Funcion que devuelve los usuarios
 */
router.get('/ultimosAccesos', function(req, res) {

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

  date1 = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
  //Accesos hace 1 semana
  mongoUser.count({"fechaAcceso": {$gt: date1}, "tipoUser":1},function(err,data){
    if(err){
      response = {"error" : true,"message" : "Error fetching data"};
      res.json(response);
    } else{
      datos.push(data);
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

router.get('/altasYbajas', function(req, res) {

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

router.get('/pois', function(req, res) {

  var myLineChart = {
    type: 'line',
    data: {},
    options: {}
  };

  var response = {};
  var datos = [];
  var date1 = new Date().setHours(0,0,0);
  var date2 = new Date().setHours(0,0,0);

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

module.exports = router;
