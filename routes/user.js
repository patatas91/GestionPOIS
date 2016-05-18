/**
 * Created by patatas91 on 2/05/16.
 */
var express = require('express');
var router = express.Router();
var middleware = require('../middleware')


/* Devuelve la página de inicio del usuario. */
router.get('/', middleware.ensureAuthenticatedUser, function(req, res) {
    res.sendfile('./views/user.html');
});

module.exports = router;

