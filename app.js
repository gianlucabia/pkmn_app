var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('routes');
const db = require('db');
const validator = require('validator');
var mysql = require('mysql')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// routers
var indexRouter = require('./routes/index');
var createRouter = require('./routes/create');
var updateRouter = require('./routes/update');
var listRouter = require('./routes/list');
var teamRouter = require('./routes/team');

app.use('/', indexRouter);
app.use('/team/update', updateRouter);
app.use('/team', teamRouter)
app.use('/team/create', createRouter);
app.use('/team/list', listRouter);

app.get('/team/:teamid/edit', function(req, res, next) {
  if(!validator.isNumeric(req.params.teamid)){
    res.send('Parameter error: invalid parameters');
  }else{
    db.query("SELECT * FROM teams WHERE id = "+ req.params.teamid+";", (err, rows, fields) => {
      if(err){
          res.send('Query error: ' + err.sqlMessage);
      }else{
        var data = JSON.stringify(rows)
        console.log('Query result: '+ data)
        res.render('edit.ejs', {name: rows[0].name, id: rows[0].id})
      }
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.ejs');
});

module.exports = app;
