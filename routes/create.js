var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query.name);
  db.query("INSERT INTO teams(id,name) SELECT MAX(id)+1,'"+req.query.name+"' FROM teams;", (err, rows, fields) => {
    if(err){
      res.send('ERROR: NAME MUST NOT BE NULL. Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows);
      console.log('Team inserted correctly: '+ data);
      res.render('create.ejs', {name: req.query.name});
    }
  });
});

module.exports = router;
