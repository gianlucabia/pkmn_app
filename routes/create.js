var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  db.query("INSERT INTO teams(id,name) SELECT MAX(id)+1,'"+req.body.name+"' FROM teams;", (err, rows, fields) => {
    if(err){
      res.send('Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows);
      console.log('Team inserted correctly: '+ data);
      res.render('create.ejs', {id: req.body.id, name: req.body.name, data: rows});
    }
  });
});

module.exports = router;
