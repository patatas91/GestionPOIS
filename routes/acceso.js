var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

/* GET home page. */
router.get('/', middleware.ensureAuthenticatedVisitante, function(req, res) {
    res.sendfile('./views/acceso.html');
});

module.exports = router;

