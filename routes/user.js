/**
 * Created by patatas91 on 2/05/16.
 */
var express = require('express');
var router = express.Router();

/* Devuelve la página de inicio del usuario. */
router.get('/', function(req, res) {
    res.sendfile('./views/user.html');
});

module.exports = router;

