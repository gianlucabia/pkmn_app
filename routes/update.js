var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Name: "+req.query.name);
  console.log(req.query.name!="");
  console.log("id: "+req.query.id);
  db.query("UPDATE teams SET name = '"+req.query.name+"' WHERE id = "+req.query.id+";", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
        console.log('Query error: ' + err.sqlMessage)
    }else{
      var data = JSON.stringify(rows);
      console.log('Team updated correctly: '+ data);
      res.render('update.ejs', {name: req.query.name});
    }
  });
  
});

module.exports = router;
