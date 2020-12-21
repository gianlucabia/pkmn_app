var express = require('express');
var sessionStorage = require('node-sessionstorage')
var fetch = require('node-fetch')
var router = express.Router();
var EventEmitter = require('events').EventEmitter;

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var download = new EventEmitter();

  db.query("SELECT * FROM teams INNER JOIN pokemon ON teams.id = pokemon.teamid ", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows)
      console.log('Query result: '+ data)

      var pokeData = {};
      var pokemons = []
      pokeData.pokemons = pokemons;
      
      for (var i=0; i<rows.length; i++){

        var pokeid=rows[i].pokeid
        var received = 0;
        if (sessionStorage.getItem(pokeid) != null) {
          console.log("Found pokemon "+pokeid)
          var pokemon=sessionStorage.getItem(pokeid)
          pokeData.pokemons.push(pokemon);
        }
        else{
          console.log("Not found pokemon "+pokeid)
          fetch('https://pokeapi.co/api/v2/pokemon/'+pokeid)
            .then(function(response){
            response.json()
            .then(function(p){
              //console.log(JSON.stringify(p))
              sessionStorage.setItem(pokeid, JSON.stringify(p));
              pokeData.pokemons.push(p);
              console.log(JSON.stringify(p).substring(0,32))
              received+=1;
              if(rows.length==received){
                download.emit('completed')
              }
            })
          })
        }
      }      

      download.on('completed', function(){
        //console.log(JSON.stringify(pokeData))
        res.render('list.ejs', {data: rows, pokeData: pokeData})
      });
      
    }
  });
});

module.exports = router;
