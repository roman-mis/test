'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    controller=require('../controllers/lastLogController')(db);
module.exports = function(app){
  app.use('/api/lastlog', router);
};


router.get('/:id/lastlog', controller.getRecentLogs);
