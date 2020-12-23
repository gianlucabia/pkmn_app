var express = require('express');
var sessionStorage = require('sessionstorage')
var fetch = require('node-fetch')
var router = express.Router();
var EventEmitter = require('events').EventEmitter;
var Mutex = require('async-mutex').Mutex;

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("Request: "+JSON.stringify(req.query));
  var download = new EventEmitter();
  const mutex = new Mutex();

  db.query("SELECT * FROM teams INNER JOIN pokemon ON teams.id = pokemon.teamid ORDER BY teams.id DESC ", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows)
      console.log('Query result: '+ data)

      var pokeData = {};
      var pokemons = [];
      pokeData.pokemons = pokemons;

      var types = {}
      var type = []
      types.type = type;
      var received = 0;
      var k=0;
      var t=[];

      for (let i=0; i<rows.length; i++){

        (function(j){ 

          console.log("iteration: "+j)
          
          var pokeid=rows[j].pokeid
          console.log("Tot pkmn: "+rows.length)
          
          console.log("flag: "+!sessionStorage.getItem(pokeid))

          //TODO: fix session storage not working
          if (false /*!sessionStorage.getItem(pokeid)*/) {
            mutex
              .acquire()
              .then(function(release) {
                console.log("acquired mutex")
                var pokemon=sessionStorage.getItem(pokeid)
                pokeData.pokemons.push(JSON.parse(pokemon));
            
                received+=1;
                console.log("Received: "+received)
                
                console.log("found pokemon: "+JSON.stringify(pokemon))

                for (j=0; j<pokemon.types.length; j++){
                  insertUniqueInArray(types, pokemon.types[j])
                }

                insertPokemonType(t, types)
                
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

                      t = insertPokemonType(p, t)
                    
                      
                      if (i>0 && rows[i-1].teamid!=rows[i].teamid){
                        console.log("Types : "+t)
                        types.type.push(t)
                        console.log("Team completed : "+k)
                        k+=1;
                        t=[]
                      }

                      console.log("released mutex")

                      if(rows.length==received){
                        console.log("Types : "+t)
                        types.type.push(t)
                        console.log("Team completed : "+k)
                        k+=1;
                        t=[]
                        mutex.release()
                        download.emit('completed')
                      }
                      mutex.release()
                    });
                  })
              })
          }
          types
        })(i);
      }      

      if (rows.length==0){
        console.log("NO TEAMS")
        res.render('list.ejs', {data: rows, pokeData: pokeData,  pokeType: null})
      }

      download.on('completed', function(){
        console.log("completed!")
        //console.log("types: "+JSON.stringify(types))
        console.log("data: "+JSON.stringify(rows))
        //console.log("pokeData: "+JSON.stringify(pokeData))
        res.render('list.ejs', {data: rows, pokeData: pokeData, pokeType: types, request: req.query})
      });
      
    }
  });
});

module.exports = router;

function insertPokemonType(pokemon, array){

  for (j=0; j<pokemon.types.length; j++){
    //console.log("type "+j+": "+pokemon.types[j].type.name)
    insertUnique(pokemon.types[j].type.name,array)
  }

  return array;
}

function insertUnique (object, array){

  if (!array.includes(object)){
    array.push(object)
  }

  return array;

}
