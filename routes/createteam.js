var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Request: "+JSON.stringify(req.query));

  var isEmpty=false;
  db.query("SELECT COUNT(id) AS n FROM teams; ", (err0, rows0, fields) => {
    if(err0){
        res.send('Query error: ' + err0.sqlMessage);
        console.log('Query error: ' + err0.sqlMessage)
    }else{
      var teamId= rows0[0].n
      console.log("n: "+teamId)
      if (JSON.stringify(teamId)=="0"){
        isEmpty=true;
      }

      if (isEmpty){
        //query if db is empty
        db.query("INSERT INTO teams(id,name) VALUES(0,'"+req.query.name+"');", (err1, rows1, fields1) => {
          if(err1){
            res.send('Query error: ' + err1.sqlMessage);
          }
          else{
            var data = JSON.stringify(rows1);
            console.log('Team inserted correctly: '+ data);
            for (var key of Object.keys(req.query)) {
              console.log(key + " -> " + req.query[key])
              //insert into pokemon teamID, req.query[key]
            }
            res.render('createteam.ejs', {name: req.query.name, teamid: teamId});
          }
        });
      } else{
        //query if db is not empty
          db.query("INSERT INTO teams(id,name) SELECT MAX(id)+1,'"+req.query.name+"' FROM teams;", (err, rows, fields) => {
          if(err){
            res.send('Query error: ' + err.sqlMessage);
          }else{
            var data = JSON.stringify(rows);
            console.log('Team inserted correctly: '+ data);
            for (var key of Object.keys(req.query)) {
              console.log(key + " -> " + req.query[key])
              //insert teamID, pokeid
            }
            res.render('createteam.ejs', {name: req.query.name, teamid: teamId});
          }
        });
      }
    }
    /*
    var l = sessionStorage.length;
    for (var i=0; i<l; i++){
      var key = sessionStorage.key(0);
      var pokeid = sessionStorage.getItem(key); 
      sessionStorage.removeItem(key);
      db.query("INSERT INTO pokemon VALUES ("+teamId+","+pokeId+");", (err, rows, fields) => {
        if(err){
          res.send('Query error: ' + err.sqlMessage);
          console.log('Query error: ' + err.sqlMessage)
        }else{
          var data = JSON.stringify(rows);
          console.log('Team inserted correctly: '+ data);
          res.render('createteam.ejs', {name: req.query.name});
        }
      });
    }*/
  });
});

module.exports = router;
