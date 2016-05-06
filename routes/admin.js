/**
 * Created by diego on 30/04/2016.
 */
var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

/* GET home page for admin. */
router.get('/', middleware.ensureAuthenticatedAdmin,function(req, res) {
    res.sendfile('./views/admin.html');
});

module.exports = router;
