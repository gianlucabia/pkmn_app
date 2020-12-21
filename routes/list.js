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
      
      for (let i=0; i<rows.length; i++){

        setTimeout(function() { alert(i) }, 0);

        var pokeid=rows[i].pokeid
        var received = 0;
        console.log("Tot pkmn: "+rows.length)
        
        if (sessionStorage.getItem(pokeid) != null) {
          console.log("Found pokemon "+pokeid+" in cache")
          var pokemon=sessionStorage.getItem(pokeid)
          console.log("poke id: "+pokemon.id+" name :"+pokemon.name)
          pokeData.pokemons.push(JSON.parse(pokemon));
          mutex
            .acquire()
            .then(function(release) {
              console.log("acquired mutex")
              received+=1;
              console.log("Received: "+received)
              console.log("released mutex")
              mutex.release()
              if(rows.length==received){
                download.emit('completed')
              }
            });
          
        }
        else{
          console.log("Not found pokemon "+pokeid+" in cache")
          fetch('https://pokeapi.co/api/v2/pokemon/'+pokeid)
            .then(function(response){
            response.json()
            .then(function(p){
              //console.log(JSON.stringify(p))
              sessionStorage.setItem(pokeid, JSON.stringify(p));
              pokeData.pokemons.push(p);
              //console.log(JSON.stringify(p).substring(0,32))
              mutex
                .acquire()
                .then(function(release) {
                  console.log("acquired mutex")
                  received+=1;
                  console.log("Received: "+received)
                  console.log("released mutex")
                  mutex.release()
                  if(rows.length==received){
                    download.emit('completed')
                  }
                });
            })
          })
        }
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
