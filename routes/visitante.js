var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.sendfile('./views/visitante.html');
});

module.exports = router;

