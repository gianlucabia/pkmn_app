var express = require('express');
var sessionStorage = require('sessionstorage')
var fetch = require('node-fetch')
var router = express.Router();
var EventEmitter = require('events').EventEmitter;
var Mutex = require('async-mutex').Mutex;

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var download = new EventEmitter();
  const mutex = new Mutex();

  db.query("SELECT * FROM teams INNER JOIN pokemon ON teams.id = pokemon.teamid ORDER BY teams.id DESC ", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows)
      console.log('Query result: '+ data)

      var pokeData = {};
      var pokemons = []
      pokeData.pokemons = pokemons;
      var received = 0;

      for (let i=0; i<rows.length; i++){

        (function(j){ 

          console.log("iteration: "+j)
          
          var pokeid=rows[j].pokeid
          console.log("Tot pkmn: "+rows.length)
          
          if (sessionStorage.getItem(pokeid) != null) {
            mutex
              .acquire()
              .then(function(release) {
                console.log("acquired mutex")
                var pokemon=sessionStorage.getItem(pokeid)
                pokeData.pokemons.push(JSON.parse(pokemon));
            
                received+=1;
                console.log("Received: "+received)
                console.log("released mutex")
                
                if(rows.length==received){
                  mutex.release()
                  download.emit('completed')
                }
                mutex.release()
              });
            
          }
          else{
            mutex
              .acquire()
              .then(function(release) {
                console.log("acquired mutex")
                fetch('https://pokeapi.co/api/v2/pokemon/'+pokeid)
                  .then(function(response){
                    response.json()
                    .then(function(p){
                      //console.log(JSON.stringify(p))
                      sessionStorage.setItem(pokeid, JSON.stringify(p));
                      pokeData.pokemons.push(p);
                      //console.log(JSON.stringify(p).substring(0,32))
              
                      received+=1;
                      console.log("Received: "+received)
                      console.log("released mutex")
                      
                      if(rows.length==received){
                        mutex.release()
                        download.emit('completed')
                      }
                      mutex.release()
                    });
                  })
              })
          }
        })(i);
      }      

      if (rows.length==0){
        console.log("NO TEAMS")
        res.render('list.ejs', {data: rows, pokeData: pokeData})
      }

      download.on('completed', function(){
        console.log("completed!")
        console.log("data: "+rows)
        console.log("pokeData: "+pokeData)
        res.render('list.ejs', {data: rows, pokeData: pokeData})
      });
      
    }
  });
});

module.exports = router;
