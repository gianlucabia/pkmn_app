var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("Name: "+req.query.name);
  console.log("id: "+req.query.id);
  db.query("UPDATE teams SET name = '"+req.query.name+"' WHERE id = "+req.query.id+";", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
        console.log('Query error: ' + err.sqlMessage)
    }else{
      var teamName = req.query.name
      var teamId = req.query.id
      delete req.query.name;
      delete req.query.id;

      console.log(Object.keys(req.query).length)
      // delete pokemon if requested
      if(Object.keys(req.query).length>0){

        var q = createDeleteFromJson(teamId,req.query)

        //delete pokemon
        db.query(q, (errq, rowsq, fields) => {
          if(errq){
            res.send('Query error: ' + errq.sqlMessage);
          }else{

            // delete team if empty
            db.query("SELECT COUNT(*) AS n FROM pokemon WHERE teamid = "+teamId, (errt, rowst, fields) => {
              if(errt){
                res.send('Query error: ' + errt.sqlMessage);
              }else{
                if(rowst[0].n==0){
                  db.query("DELETE FROM teams WHERE id = "+teamId, (errx, rowsx, fields) => {
                    if(errx){
                      res.send('Query error: ' + errx.sqlMessage);
                    }else{
                      var dataq = JSON.stringify(rowsq);
                      console.log('Team deleted correctly: '+ dataq);                
                      res.render('update.ejs', {name: teamName, teamid: -1});
                    }
                  });
                }else{
                  var data = JSON.stringify(rows);
                  console.log('Team updated correctly: '+ data);                
                  res.render('update.ejs', {name: teamName, teamid: teamId});
                }
              }
            });
          }
        });
      }
      else{
        var data = JSON.stringify(rows);
        console.log('Team updated correctly: '+ data);    
        res.render('update.ejs', {name: teamName, teamid: teamId});
      }
    }
  });
  
});

function createDeleteFromJson(teamid,obj){
  // prepare insert query
  console.log("Request delete: "+JSON.stringify(obj))
  var q = "DELETE FROM pokemon WHERE"
  for (var key of Object.keys(obj)) {
    console.log(key + " -> " + obj[key])
    q = q+" (teamid="+teamid+" AND pokeid="+key+") OR";
  }
  q = q.substring(0, q.length - 3);
  q = q+";"
  console.log('Query q '+ q);
  return q;
}

module.exports = router;
