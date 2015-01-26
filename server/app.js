'use strict';

var express = require('express'),
    db = require('./models'),
    http = require('http');

var app = express();

require('./config/express')(app);
console.log("hi")
// db
// .sequelize
// .sync({force:false})
// .complete(function(err){
//   if(err){
//     throw err[0]; 
//   } else {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Server listening on port ' + app.get('port'));
    });
//   }
// });