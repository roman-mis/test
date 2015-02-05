'use strict';

var express = require('express'),
    /*utils=require('../utils/utils'),
    db = require('../models'),*/
    router = express.Router();

module.exports = function(app){
  app.use('/api/mongoosetest', router);
};
