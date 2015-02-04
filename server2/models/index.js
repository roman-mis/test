'use strict';
var fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  lodash = require('lodash'),
  db = {};
  var autoIncrement=require('mongoose-auto-increment');

// var sequelize = new Sequelize(process.env.DATABASE_URL, {
//   debug: false,
//   logging: console.log,
//   define: {
//     underscored: false
    
//   },
// });
var conn=mongoose.createConnection(process.env.DATABASE_URL);
// var conn=mongoose;
autoIncrement.initialize(conn);

//console.log('here is mongoose');
//console.log(mongoose.connections[0].db);

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.js') >= 0) && (file !== 'index.js')&& (file !== 'baseschema.js');
}).forEach(function (file) {
  console.log('getting '+file);

  var model = require(path.join(__dirname, file))(conn,autoIncrement);
  // console.log(model);
  if(model && model.schema){
    // console.log('model : '+model.modelName);
    // console.log('skipCreatedDate : '+model.schema.get('skipCreatedDate'));
    // console.log('skipCreatedDate : '+model.schema.get('skipUpdatedBy'));
    db[model.modelName] = model;
  }
  // else{console.log(model);}
  
});

// Object.keys(db).forEach(function (modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });

module.exports = lodash.extend({
  DB: conn
  }, db);
