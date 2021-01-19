var express = require('express');
var router = express.Router();
var config = require('../config/config');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(config.infura);
});

module.exports = router;
