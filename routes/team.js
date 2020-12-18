var express = require('express');
var router = express.Router();

/* GET team mgmt page. */
router.get('/', function(req, res, next) {
  res.render('team.ejs');
});

module.exports = router;
