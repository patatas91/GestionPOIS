var express = require('express');
var router = express.Router();
var mongoUser = require("../models/mongoUser");

/**
 * Funcion que devuelve los usuarios
 */
router.get('/lastAccess', function(req, res) {

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

module.exports = router;
