/**
 * Created by diego on 30/04/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.sendfile('./views/admin.html');
});

module.exports = router;
