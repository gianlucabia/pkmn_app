var express = require('express');
var router = express.Router();

const db = require('db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  db.query("SELECT * FROM teams ", (err, rows, fields) => {
    if(err){
        res.send('Query error: ' + err.sqlMessage);
    }else{
      var data = JSON.stringify(rows)
      console.log('Query result: '+ data)
      res.render('list.ejs', {data: rows})
    }
  });
});

module.exports = router;
