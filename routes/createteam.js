var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Request: "+JSON.stringify(req.query));

  var isEmpty=false;
  db.query("SELECT MAX(id)+1 AS n FROM teams; ", (err0, rows0, fields) => {
    if(err0){
        res.send('Query error: ' + err0.sqlMessage);
        console.log('Query error: ' + err0.sqlMessage)
    }else{
      var teamId = 0;
      if (rows0[0].n != null){
        teamId=rows0[0].n
      }
      console.log("teamid: "+teamId)
      if (JSON.stringify(teamId)=="0"){
        isEmpty=true;
      }
      // devo inserire team con almeno un pokemon
      //console.log("length: "+Object.keys(req.query).length)
      if (Object.keys(req.query).length>1){
        if (isEmpty){
          //query if db is empty
          db.query("INSERT INTO teams(id,name) VALUES(0,'"+req.query.name+"');", (err1, rows1, fields1) => {
            if(err1){
              res.send('Query error: ' + err1.sqlMessage);
            }
            else{
              var data = JSON.stringify(rows1);
              //console.log('Team created correctly: '+ data);
              var teamName = req.query.name
              delete req.query.name;
              
              // prepare insert query
              var q=createInsertFromJson(teamId,req.query);

              // add pokemon to team
              db.query(q, (errq, rowsq, fields) => {
                if(errq){
                  res.send('Query error: ' + errq.sqlMessage);
                }else{
                  var dataq = JSON.stringify(rowsq);
                  console.log('Team inserted correctly: '+ dataq);                
                  res.render('createteam.ejs', {name: teamName, teamid: teamId});
                }
              });
            }
          });
        } else{
          // query if db is not empty
            db.query("INSERT INTO teams(id,name) SELECT MAX(id)+1,'"+req.query.name+"' FROM teams;", (err, rows, fields) => {
            if(err){
              res.send('Query error: ' + err.sqlMessage);
            }else{
              var data = JSON.stringify(rows);
              console.log('Team created correctly: '+ data);
              var teamName = req.query.name
              delete req.query.name;
              
              // prepare insert query
              
              var q=createInsertFromJson(teamId,req.query);

              // add pokemon to team
              db.query(q, (errq, rowsq, fields) => {
                if(errq){
                  res.send('Query error: ' + errq.sqlMessage);
                }else{
                  var dataq = JSON.stringify(rowsq);
                  console.log('Team insteamerted correctly: '+ dataq);                
                  res.render('createteam.ejs', {name: teamName, teamid: teamId});
                }
              });
              
            }          
          });
        }
      }
      else{
        res.render('createteam.ejs', {name: req.query.name, teamid: -1});
      }
    }
  });
});

function createInsertFromJson(teamid,obj){
  // prepare insert query
  
  var q = "INSERT INTO pokemon(teamid,pokeid) VALUES"
  for (var key of Object.keys(obj)) {
    console.log(key + " -> " + obj[key])
    q = q+" ("+teamid+","+obj[key]+"),";
  }
  q = q.substring(0, q.length - 1);
  q = q+";"
  console.log('Query q '+ q);
  return q;
}

module.exports = router;
