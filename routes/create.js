var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Name: "+req.query.name);
  console.log(req.query.name!="");
  var isEmpty=false;
  db.query("SELECT COUNT(id) AS n FROM teams; ", (err0, rows0, fields) => {
    if(err0){
        res.send('Query error: ' + err0.sqlMessage);
        console.log('Query error: ' + err0.sqlMessage)
    }else{
      console.log("n: "+rows0[0].n)
      if (JSON.stringify(rows0[0].n)=="0"){
        isEmpty=true;
      }
      if (isEmpty){
        db.query("INSERT INTO teams(id,name) VALUES(0,'"+req.query.name+"');", (err1, rows1, fields1) => {
          if(err1){
            res.send('Query error: ' + err1.sqlMessage);
          }
          else{
            var data = JSON.stringify(rows1);
            console.log('Team inserted correctly: '+ data);
            res.render('create.ejs', {name: req.query.name});
          }
        });
      } else{
          db.query("INSERT INTO teams(id,name) SELECT MAX(id)+1,'"+req.query.name+"' FROM teams;", (err, rows, fields) => {
          if(err){
            
          }else{
            var data = JSON.stringify(rows);
            console.log('Team inserted correctly: '+ data);
            res.render('create.ejs', {name: req.query.name});
          }
        });
      }
    }
  });
  
});

module.exports = router;
