'use strict';

var express = require('express'),
    http = require('http');

var app = express();

require('./config/express')(app);
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